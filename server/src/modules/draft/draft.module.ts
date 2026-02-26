import { db } from '@/core/db/connection'
import { DraftRepository } from './draft.repository'

import { DraftService } from './draft.service'
import { DraftController } from './draft.controller'

const draftRepository = new DraftRepository(db)
const draftService = new DraftService(draftRepository)

const draftController = new DraftController(draftService)

export { draftController, draftService, draftRepository }

