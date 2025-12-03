import { db } from '@/core/db/connection'
import { NotificationService } from '@/core/notification/notification.service'

import { MemberService } from '../members/member.service'

import { InvitationController } from './invitation.controller'
import { InvitationService } from './invitation.service'
import { InvitationRepository } from './invitation.repository'

// Initialize services
const notificationService = new NotificationService()
const memberService = new MemberService()

// Initialize InvitationRepository and InvitationService
const invitationRepository = new InvitationRepository(db)
const invitationService = new InvitationService(notificationService, memberService, invitationRepository)

// Initialize InvitationController with the InvitationService
const invitationController = new InvitationController(invitationService)

export { invitationController, invitationService }
