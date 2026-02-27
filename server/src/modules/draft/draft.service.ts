import OpenAI from 'openai'
import { BadRequestError } from '@/util'
import { IDraftRepository } from './draft.repository'
import { CreateDraft, Draft } from './draft.types'
import { openaiConfig } from '@/config/openai'

export interface IDraftService {
    findAll(docId: string): Promise<Draft[]>
    findById(id: string, docId: string): Promise<Draft>
    create(input: CreateDraft): Promise<Draft>
    update(id: string, data: Partial<CreateDraft>): Promise<Draft>
    delete(id: string): Promise<void>
    generateContent(prompt: string): Promise<string | null>
}

export class DraftService implements IDraftService {
    private readonly openai: OpenAI
    constructor(private readonly draftRepository: IDraftRepository) {
        this.openai = new OpenAI({
            apiKey: openaiConfig.apiKey
        })
    }

    async findAll(docId: string) {
        return this.draftRepository.findAll(docId)
    }

    async findById(id: string, docId: string): Promise<Draft> {
        const draft = await this.draftRepository.findById(id, docId)
        if (!draft) {
            throw new BadRequestError('Draft not found')
        }
        return draft
    }

    async create(input: CreateDraft) {
        return this.draftRepository.create(input)
    }

    async update(id: string, data: Partial<CreateDraft>): Promise<Draft> {
        return this.draftRepository.update(id, data)
    }

    async delete(id: string): Promise<void> {
        return this.draftRepository.delete(id)
    }

    async generateContent(prompt: string): Promise<string | null> {
        const completion = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo'
        })

        return completion.choices[0].message.content
    }
}
