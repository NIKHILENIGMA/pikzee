import { db } from '@/core'
import { googleConfig } from '@/config'

import { SmartPublishController } from './smart-publish.controller'
import { SmartPublishService } from './smart-publish.service'
import { SmartPublishRepository } from './smart-publish.repository'

import { workspaceRepository } from '../workspace'
import { StrategyFactory } from './strategies/strategy.factory'

// Initialize repository with database connection
const smartPublishRepository = new SmartPublishRepository(db)

// Initialize Strategy Factory
const strategyFactory = new StrategyFactory(
    smartPublishRepository,
    workspaceRepository,
    googleConfig
)

// Initialize service with repository and strategy factory
const smartPublishService = new SmartPublishService(smartPublishRepository, strategyFactory)

// Initialize controller with service
const smartPublishController = new SmartPublishController(smartPublishService)

export { smartPublishController, smartPublishService, smartPublishRepository }
