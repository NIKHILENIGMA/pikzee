import { db } from '@/core/db/connection'
import { NotificationService } from '@/core/notification/notification.service'

import { InvitationController } from './invitation.controller'
import { InvitationService } from './invitation.service'
import { InvitationRepository } from './invitation.repository'
import { memberService } from '../members'

// Initialize services
const notificationService = new NotificationService()

// Initialize InvitationRepository and InvitationService
const invitationRepository = new InvitationRepository(db)
const invitationService = new InvitationService(
    notificationService,
    memberService,
    invitationRepository
)

// Initialize InvitationController with the InvitationService
const invitationController = new InvitationController(invitationService)

export { invitationController, invitationService }
