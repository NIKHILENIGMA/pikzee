import OpenAI from 'openai'

import { BadRequestError, ForbiddenError, NotFoundError } from '@/util'
import { openaiConfig } from '@/config/openai'

import { IDraftRepository } from './draft.repository'
import { CreateDraft, Draft, DraftCoverImageType, DraftSettings } from './draft.types'

import { MemberPermission } from '../members'
import { IMemberRepository } from '../members/member.repository'

export interface IDraftService {
    findAll(docId: string): Promise<Draft[]>
    findById(id: string, docId: string): Promise<Draft>
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
    visual(
        draftId: string,
        record: {
            userId: string
            workspaceId: string
            icon: string | null
            finalUrl: string | null
            finalType: DraftCoverImageType
            positionY?: number
        }
    ): Promise<Draft | null>
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

    async findById(id: string, docId: string): Promise<Draft> {
        const draft = await this.repository.findById(id, docId)
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

    async visual(
        draftId: string,
        record: {
            userId: string
            workspaceId: string
            icon: string | null
            finalUrl: string | null
            finalType: DraftCoverImageType
            positionY?: number
        }
    ): Promise<Draft | null> {
        this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['EDIT', 'FULL_ACCESS'],
            'User does not have permission to update draft visuals'
        )

        const changeVisual = await this.repository.visual(draftId, record)

        // Only mark as updated if the visual was successfully changed
        if (changeVisual) {
            await this.repository.markAsUpdated(draftId, record.userId)
        }

        return changeVisual
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
