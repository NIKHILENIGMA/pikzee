import { db } from '@/core/db/connection'
import { NotificationService } from '@/core/notification/notification.service'

import { InvitationController } from './invitation.controller'
import { InvitationService } from './invitation.service'
import { InvitationRepository } from './invitation.repository'
import { memberService } from '../members'
import { workspaceService } from '../workspace'
import { userService } from '../user'

// Initialize services
const notificationService = new NotificationService()

// Initialize InvitationRepository and InvitationService
const invitationRepository = new InvitationRepository(db)

// Initialize InvitationService with its dependencies
const invitationService = new InvitationService(
    notificationService,
    memberService,
    workspaceService,
    userService,
    invitationRepository
)

// Initialize InvitationController with the InvitationService
const invitationController = new InvitationController(invitationService)

export { invitationController, invitationService }
