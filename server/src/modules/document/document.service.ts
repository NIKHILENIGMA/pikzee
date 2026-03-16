import { BadRequestError, ForbiddenError, NotFoundError } from '@/util'

import { IDocRepository } from './document.repository'
import {
    CreateDocumentDTO,
    CreateDocumentInput,
    Document,
    DocumentDTO,
    DocumentVisibility,
    ShareAction
} from './document.types'

import { IDraftRepository } from '../draft/draft.repository'
import { IMemberRepository } from '../members/member.repository'
import { MemberPermission } from '../members'
import { generateToken } from '@/lib/encrypt-decrypt'

export interface IDocService {
    create(input: CreateDocumentInput): Promise<CreateDocumentDTO>
    delete(docId: string, record: { userId: string; workspaceId: string }): Promise<void>
    findById(id: string, userId: string, workspaceId: string): Promise<DocumentDTO>
    findAll(workspaceId: string, limit?: number, page?: number): Promise<Document[]>
    archive(documentId: string, record: { userId: string; workspaceId: string }): Promise<void>
    restore(documentId: string, record: { userId: string; workspaceId: string }): Promise<void>
    share(
        documentId: string,
        record: {
            userId: string
            workspaceId: string
            action: ShareAction
        }
    ): Promise<{
        token: string | null
    }>
    changeVisibility(
        id: string,
        record: {
            userId: string
            workspaceId: string
            visibility: DocumentVisibility
        }
    ): Promise<void>
    getPublicDocument(id: string, options: { workspaceId: string; token: string }): Promise<any>
}

export class DocumentService implements IDocService {
    constructor(
        private readonly repository: IDocRepository,
        private readonly draftRepository: IDraftRepository,
        private readonly memberRepository: IMemberRepository
    ) {}

    async create(input: CreateDocumentInput): Promise<CreateDocumentDTO> {
        const permission: MemberPermission | null =
            await this.memberRepository.getPermissionByUserId(input.createdBy)

        if (!permission || (permission !== 'FULL_ACCESS' && permission !== 'EDIT')) {
            throw new ForbiddenError(
                'User does not have permission to create a document in this workspace'
            )
        }

        // Use a transaction to ensure both document and initial draft are created successfully
        const [doc, draft] = await this.repository.transaction(async (tx) => {
            // Create the document
            const createdDoc = await this.repository.createDocumentTransaction(tx, {
                ...input,
                permission: input.visibility, 
                createdAt: new Date(),
            })
            if (!createdDoc) {
                throw new BadRequestError('Failed to create document', 'DOCUMENT_CREATION_FAILED')
            }

            // Create an initial draft for the document
            const initialDraft = await this.draftRepository.createDraftTransaction(tx, {
                docId: createdDoc.id,
                ownerId: input.createdBy,
                lastUpdatedBy: input.createdBy,
                content: '' // Initialize with empty content or a default template
            })

            return [createdDoc, initialDraft] as const
        })

        return { ...doc, initialDraftId: draft.id } // Assuming draftId is the same as document id for the initial draft
    }

    async delete(docId: string, record: { userId: string; workspaceId: string }): Promise<void> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['FULL_ACCESS'],
            'User does not have permission to delete this document'
        )

        const deletedDoc = await this.repository.delete(docId)

        if (!deletedDoc) {
            const existingDoc = await this.repository.findDocById(docId, record.workspaceId)
            if (!existingDoc) {
                throw new NotFoundError('Document not found', 'DOCUMENT_NOT_FOUND')
            }
            throw new ForbiddenError('User does not have permission to delete this document')
        }
    }

    async findById(id: string, userId: string, workspaceId: string): Promise<DocumentDTO> {
        const document = await this.repository.findById(id, workspaceId)

        if (!document) {
            throw new NotFoundError('Document not found', 'DOCUMENT_NOT_FOUND')
        }

        if (document.docs.permission === 'private' && document.docs.createdBy !== userId) {
            throw new ForbiddenError('User does not have permission to access this document')
        }

        return {
            id: document.docs.id,
            createdBy: document.docs.createdBy,
            workspaceId: document.docs.workspaceId,
            defaultDraftId: document.drafts ? document.drafts.id : ''
        }
    }

    async findAll(workspaceId: string): Promise<Document[]> {
        return this.repository.findAll(workspaceId)
    }

    async archive(
        documentId: string,
        record: { userId: string; workspaceId: string }
    ): Promise<void> {
        // Ensure the user has permission to archive the document
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['FULL_ACCESS', 'EDIT'],
            'User does not have permission to archive this document'
        )

        // Archive the document by setting isArchived to true and archivedAt to current timestamp
        const archivedDocument = await this.repository.update(documentId, {
            isArchived: true,
            archivedAt: new Date()
        })

        if (!archivedDocument) {
            await this.ensureDocumentExists(documentId, record.workspaceId)

            throw new ForbiddenError(
                'User does not have permission to archive this document',
                'DOCUMENT_ARCHIVE_FAILED'
            )
        }
    }

    async restore(
        documentId: string,
        record: { userId: string; workspaceId: string }
    ): Promise<void> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['FULL_ACCESS', 'EDIT'],
            'User does not have permission to restore this document'
        )

        const archivedDocument = await this.repository.restore(documentId, record.workspaceId)

        if (!archivedDocument) {
            await this.ensureDocumentExists(documentId, record.workspaceId)

            throw new ForbiddenError(
                'User does not have permission to restore this document',
                'DOCUMENT_RESTORE_FAILED'
            )
        }
    }

    async share(
        documentId: string,
        record: {
            userId: string
            workspaceId: string
            action: ShareAction
        }
    ): Promise<{
        token: string | null
    }> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['FULL_ACCESS'],
            'User does not have permission to share this document'
        )

        await this.ensureDocumentExists(documentId, record.workspaceId)

        let newToken: string | null = null
        if (record.action === 'generate') {
            newToken = generateToken()

            await this.repository.share(documentId, {
                workspaceId: record.workspaceId,
                token: newToken
            })

            return { token: newToken }
        } else if (record.action === 'revoke') {
            await this.repository.share(documentId, {
                workspaceId: record.workspaceId,
                token: newToken
            })

            return { token: newToken }
        } else {
            throw new BadRequestError('Invalid share action', 'INVALID_SHARE_ACTION')
        }
    }

    async changeVisibility(
        id: string,
        record: {
            userId: string
            workspaceId: string
            visibility: DocumentVisibility
        }
    ): Promise<void> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['FULL_ACCESS'],
            'User does not have permission to change visibility of this document'
        )

        const document = await this.repository.visibility(id, {
            workspaceId: record.workspaceId,
            visibility: record.visibility
        })

        if (document === null) {
            // This will throw NotFoundError if document doesn't exist
            await this.ensureDocumentExists(id, record.workspaceId)

            throw new ForbiddenError(
                'User does not have permission to change visibility of this document',
                'CHANGE_DOCUMENT_VISIBILITY_FAILED'
            )
        }
    }

    async getPublicDocument(
        id: string,
        options: { workspaceId: string; token: string }
    ): Promise<any> {
        const document = await this.repository.getPublicDocument(id, options)

        if (!document) {
            throw new NotFoundError(
                'Document not found or invalid share token',
                'DOCUMENT_NOT_FOUND'
            )
        }

        return document
    }

    private async ensurePermission(
        userId: string,
        workspaceId: string,
        required: MemberPermission[],
        errMessage = 'User does not have sufficient permissions to perform this action'
    ) {
        const permission = await this.memberRepository.checkPermission(userId, workspaceId)
        // logger.info(
        //     `Checking permissions for user ${userId} in workspace ${workspaceId}: ${permission}`
        // )
        if (!permission || !required.includes(permission)) {
            throw new ForbiddenError(errMessage)
        }
    }

    private async ensureDocumentExists(id: string, workspaceId: string) {
        const doc = await this.repository.findDocById(id, workspaceId)
        if (!doc) throw new NotFoundError('Document not found', 'DOCUMENT_NOT_FOUND')
        return doc
    }
}
