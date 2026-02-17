import { db } from '@/core'
import { googleConfig } from '@/config'

import { SmartPublishController } from './smart-publish.controller'
import { SmartPublishService } from './smart-publish.service'
import { SmartPublishRepository } from './smart-publish.repository'

import { workspaceRepository } from '../workspace'

// Initialize repository with database connection
const smartPublishRepository = new SmartPublishRepository(db)

// Initialize service with repository and config
const smartPublishService = new SmartPublishService(
    smartPublishRepository,
    workspaceRepository,
    googleConfig
)

// Initialize controller with service
const smartPublishController = new SmartPublishController(smartPublishService)

export { smartPublishController, smartPublishService, smartPublishRepository }
