import { memberRepository } from '../members'
import { AIController } from './ai.controller'
import { AIService } from './ai.service'

const aiService = new AIService(memberRepository)

const aiController = new AIController(aiService)

export { aiController, aiService }
