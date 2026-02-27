import { db } from '@/core/db/connection'
import { DocRepository } from './document.repository'
import { DocumentService } from './document.service'
import { DocumentController } from './document.controller'

const documentRepository = new DocRepository(db)

export const documentService = new DocumentService(documentRepository)

export const documentController = new DocumentController(documentService)
