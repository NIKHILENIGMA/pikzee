import { BadRequestError, ForbiddenError } from '@/util'
import { IDocRepository } from './document.repository'
import { CreateDocumentDTO, CreateDocumentInput, Document } from './document.types'
import { IDraftRepository } from '../draft/draft.repository'
import { IMemberRepository } from '../members/member.repository'
import { MemberPermission } from '../members'

export interface IDocService {
    create(input: CreateDocumentInput): Promise<CreateDocumentDTO>
    update(id: string, workspaceId: string, data: Partial<Document>): Promise<Document>
    delete(id: string, workspaceId: string): Promise<void>
    findById(id: string, workspaceId: string): Promise<Document>
    findAll(workspaceId: string): Promise<Document[]>
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
            const createdDoc = await this.repository.createDocumentTransaction(tx, input)
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

    async update(id: string, workspaceId: string, data: Partial<Document>): Promise<Document> {
        // Ensure document exists and belongs to workspace
        const existingDoc = await this.existingDocCheck(id, workspaceId)
        if (!existingDoc) {
            throw new BadRequestError('Document not found', 'DOCUMENT_NOT_FOUND')
        }

        // Only title can be updated for now, but this can be extended in the future
        const updated = await this.repository.update(id, data)
        if (!updated) {
            throw new BadRequestError('Failed to update document', 'DOCUMENT_UPDATE_FAILED')
        }
        return updated
    }

    async delete(id: string, workspaceId: string): Promise<void> {
        // Ensure document exists and belongs to workspace
        await this.existingDocCheck(id, workspaceId)

        // Perform deletion
        await this.repository.delete(id)
    }

    async findById(id: string, workspaceId: string): Promise<Document> {
        const document = await this.repository.findById(id, workspaceId)

        if (!document) {
            throw new BadRequestError('Document not found', 'DOCUMENT_NOT_FOUND')
        }

        return document
    }

    async findAll(workspaceId: string): Promise<Document[]> {
        return this.repository.findAll(workspaceId)
    }

    private async existingDocCheck(id: string, workspaceId: string): Promise<Document> {
        const existingDoc = await this.repository.findById(id, workspaceId)
        if (!existingDoc) {
            throw new BadRequestError('Document not found', 'DOCUMENT_NOT_FOUND')
        }
        return existingDoc
    }
}
