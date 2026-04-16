import OpenAI from 'openai'

import { BadRequestError, ForbiddenError, NotFoundError } from '@/util'
import { openaiConfig } from '@/config/openai'

import { IDraftRepository } from './draft.repository'
import {
    CreateDraft,
    Draft,
    DraftCoverImageType,
    DraftDTO,
    DraftSettings,
    DraftSidebarDTO
} from './draft.types'

import { MemberPermission } from '../members'
import { IMemberRepository } from '../members/member.repository'

export interface IDraftService {
    findAll(docId: string): Promise<Draft[]>
    findById(draftId: string, docId: string): Promise<DraftDTO>
    create(userId: string, workspaceId: string, input: CreateDraft): Promise<Draft>
    update(id: string, data: Partial<CreateDraft>): Promise<Draft>
    delete(
        draftId: string,
        record: {
            docId: string
            userId: string
            workspaceId: string
        }
    ): Promise<void>
    addCoverImage(
        draftId: string,
        record: { userId: string; workspaceId: string; imageUrl: string }
    ): Promise<void>
    updateCoverImage(
        draftId: string,
        record: { userId: string; workspaceId: string; imageUrl: string | null; type: DraftCoverImageType }
    ): Promise<void>
    updateCoverImagePosition(
        draftId: string,
        record: { userId: string; workspaceId: string; positionY: number }
    ): Promise<void>
    updateIcon(
        draftId: string,
        record: { userId: string; workspaceId: string; icon: string | null }
    ): Promise<void>
    content(
        draftId: string,
        record: {
            workspaceId: string
            userId: string
            docId: string
            content: Partial<CreateDraft>
        }
    ): Promise<void>
    setting(
        draftId: string,
        record: {
            userId: string
            workspaceId: string
        },
        newSettings: DraftSettings
    ): Promise<void>
    getSidebar(record: {
        userId: string
        workspaceId: string
        docId: string
    }): Promise<DraftSidebarDTO[]>
    generateContent(prompt: string): Promise<string | null>
}

export class DraftService implements IDraftService {
    private readonly openai: OpenAI
    constructor(
        private readonly repository: IDraftRepository,
        private readonly memberRepository: IMemberRepository
    ) {
        this.openai = new OpenAI({
            apiKey: openaiConfig.apiKey
        })
    }

    async findAll(docId: string) {
        return this.repository.findAll(docId)
    }

    async findById(draftId: string, docId: string): Promise<DraftDTO> {
        const draft = await this.repository.findById(draftId, docId)
        if (!draft) {
            throw new BadRequestError('Draft not found')
        }
        return draft
    }

    async create(userId: string, workspaceId: string, record: CreateDraft): Promise<Draft> {
        await this.ensurePermission(userId, workspaceId, ['EDIT', 'FULL_ACCESS'])

        return this.repository.create(record)
    }

    async update(id: string, data: Partial<CreateDraft>): Promise<Draft> {
        return this.repository.update(id, data)
    }

    async content(
        draftId: string,
        record: {
            workspaceId: string
            userId: string
            docId: string
            content: Partial<CreateDraft>
        }
    ): Promise<void> {
        await this.ensurePermission(record.userId, record.workspaceId, ['EDIT', 'FULL_ACCESS'])

        await this.repository.content(draftId, {
            docId: record.docId,
            content: {
                title: record.content.title,
                content: record.content.content,
                lastUpdatedBy: record.userId,
                updatedAt: new Date()
            }
        })
    }

    async addCoverImage(
        draftId: string,
        record: { userId: string; workspaceId: string; imageUrl: string }
    ): Promise<void> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['EDIT', 'FULL_ACCESS'],
            'User does not have permission to update draft cover image'
        )
        // Add cover image by updating the visual with the new cover image URL
        await this.repository.addCoverImage(draftId, { imageUrl: record.imageUrl })

        // Mark draft as updated after changing cover image
        await this.repository.markAsUpdated(draftId, record.userId)
    }

    async updateCoverImage(
        draftId: string,
        record: { userId: string; workspaceId: string; imageUrl: string; type: DraftCoverImageType }
    ): Promise<void> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['EDIT', 'FULL_ACCESS'],
            'User does not have permission to update draft cover image'
        )
        await this.repository.updateCoverImage(draftId, {
            imageUrl: record.imageUrl,
            type: record.type
        })

        await this.repository.markAsUpdated(draftId, record.userId)
    }

    async updateCoverImagePosition(
        draftId: string,
        record: { userId: string; workspaceId: string; positionY: number }
    ): Promise<void> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['EDIT', 'FULL_ACCESS'],
            'User does not have permission to update draft cover image position'
        )
        await this.repository.updateCoverImagePosition(draftId, record.positionY)
        await this.repository.markAsUpdated(draftId, record.userId)
    }

    async removeCoverImage(
        draftId: string,
        record: { userId: string; workspaceId: string }
    ): Promise<void> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['EDIT', 'FULL_ACCESS'],
            'User does not have permission to remove draft cover image'
        )
        await this.repository.removeCoverImage(draftId)
        await this.repository.markAsUpdated(draftId, record.userId)
    }

    async updateIcon(
        draftId: string,
        record: { userId: string; workspaceId: string; icon: string | null }
    ): Promise<void> {
        // Check permissions
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['EDIT', 'FULL_ACCESS'],
            'User does not have permission to update draft icon'
        )   

        // Update icon (or remove if null)
        await this.repository.updateIcon(draftId, { icon: record.icon })

        // Mark draft as updated after changing icon
        await this.repository.markAsUpdated(draftId, record.userId)
    }

    async setting(
        draftId: string,
        record: {
            userId: string
            workspaceId: string
        },
        newSettings: DraftSettings
    ): Promise<void> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['EDIT', 'FULL_ACCESS'],
            'User does not have permission to update draft settings'
        )

        await this.repository.settings(draftId, newSettings)

        // Mark draft as updated after changing settings
        await this.repository.markAsUpdated(draftId, record.userId)
    }

    async delete(
        draftId: string,
        record: {
            docId: string
            userId: string
            workspaceId: string
        }
    ): Promise<void> {
        const drafts = await this.repository.findAll(record.docId)
        if (drafts.length === 1) {
            throw new BadRequestError('Cannot delete the only remaining draft for a document')
        }

        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['EDIT', 'FULL_ACCESS'],
            'User does not have permission to delete this draft'
        )

        const deletedDraft = await this.repository.delete(draftId)

        if (!deletedDraft) {
            const existingDraft = await this.repository.findById(draftId, record.docId)
            if (!existingDraft) {
                throw new NotFoundError('Draft not found')
            }

            throw new ForbiddenError('Failed to delete draft due to insufficient permissions')
        }

        // await this.repository.markAsUpdated(draftId, record.userId)
    }

    async getSidebar(record: {
        userId: string
        workspaceId: string
        docId: string
    }): Promise<DraftSidebarDTO[]> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['VIEW_ONLY', 'EDIT', 'FULL_ACCESS'],
            'User does not have permission to view drafts'
        )

        const drafts = await this.repository.sidebar({ docId: record.docId })

        return drafts
    }

    async generateContent(prompt: string): Promise<string | null> {
        const completion = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo'
        })

        return completion.choices[0].message.content
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
}
