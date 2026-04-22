import OpenAI from 'openai'

import { openaiConfig } from '@/config/openai'
import { ForbiddenError } from '@/util/StandardError'

import { MemberPermission } from '../members'
import { IMemberRepository } from '../members/member.repository'
import { logger } from '@/config'

export interface IAIService {
    streamGeneratedContent(
        record: { userId: string; workspaceId: string; prompt: string },
        signal?: AbortSignal
    ): AsyncGenerator<string>
}

export class AIService implements IAIService {
    private readonly openai: OpenAI
    constructor(private readonly memberRepository: IMemberRepository) {
        this.openai = new OpenAI({
            apiKey: openaiConfig.apiKey
        })
    }

    async *streamGeneratedContent(
        record: { userId: string; workspaceId: string; prompt: string },
        signal?: AbortSignal
    ): AsyncGenerator<string> {
        await this.ensurePermission(
            record.userId,
            record.workspaceId,
            ['EDIT', 'FULL_ACCESS'],
            'User does not have permission to generate AI content'
        )

        const stream = await this.openai.responses.stream(
            {
                model: 'gpt-4o-mini',
                input: record.prompt
            },
        )

        try {
            for await (const event of stream) {
                if (event.type === 'response.output_text.delta') {
                    yield event.delta
                }
            }
        } catch (error) {
            if (signal?.aborted) {
                logger.error(
                    `OpenAI stream aborted because ${(error as Error).message}`
                )
                return 
            }
            throw error
        }
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

