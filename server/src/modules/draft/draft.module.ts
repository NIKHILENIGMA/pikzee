import { db } from '@/core/db/connection'
import { DraftRepository } from './draft.repository'

import { DraftService } from './draft.service'
import { DraftController } from './draft.controller'
import { memberRepository } from '../members'
import { unsplashConfig, UnsplashService } from '@/config/unsplash/unsplash'

const draftRepository = new DraftRepository(db)
const draftService = new DraftService(draftRepository, memberRepository)

const unsplash = new UnsplashService(unsplashConfig.accessKey)
const draftController = new DraftController(draftService, unsplash)

export { draftController, draftService, draftRepository }
