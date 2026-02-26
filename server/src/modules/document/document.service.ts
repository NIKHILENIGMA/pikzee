import { BadRequestError } from '@/util'
import { IDocRepository } from './document.repository'
import { CreateDocumentInput, Document } from './document.types'

export interface IDocService {
    create(input: CreateDocumentInput): Promise<Document>
    update(id: string, workspaceId: string, data: Partial<Document>): Promise<Document>
    delete(id: string, workspaceId: string): Promise<void>
    findById(id: string, workspaceId: string): Promise<Document>
    findAll(workspaceId: string): Promise<Document[]>
}

export class DocumentService implements IDocService {
    constructor(private readonly repository: IDocRepository) {}

    async create(input: CreateDocumentInput): Promise<Document> {
        const document = await this.repository.create(input)
        if (!document) {
            throw new BadRequestError('Failed to create document', 'DOCUMENT_CREATION_FAILED')
        }
        return document
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

