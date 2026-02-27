import { db } from '@/core/db/connection'

import { AssetRepository } from './asset.repository'
import { AssetService } from './asset.service'
import { AssetController } from './asset.controller'

import { projectService } from '../projects'
import { memberService } from '../members'

const assetRepository = new AssetRepository(db)
const assetService = new AssetService(assetRepository, projectService, memberService)
const assetController = new AssetController(assetService)

export { assetController, assetService, assetRepository }
