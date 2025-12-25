import { and, eq, gt } from 'drizzle-orm'

import { type CreateInvitation, type Invitation, invitations, workspaceMembers } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'
import { GetPendingInvitationRecord } from './invitation.types'
import { MemberPermission } from '../members'

export type MarkAcceptRecord = {
    invitationId: string
    inviteeUserId: string
    workspaceId: string
    token: string
    permission: MemberPermission
}

export interface IInvitationRepository {
    create(data: CreateInvitation): Promise<Invitation>
    update(id: string, data: Partial<Invitation>): Promise<Invitation>
    delete(id: string): Promise<Invitation>
    addMemberAndMarkAccept(data: MarkAcceptRecord): Promise<void>
    getById(id: string): Promise<Invitation | null>
    getByToken(token: string): Promise<Invitation | null>
    getPendingByEmail(data: GetPendingInvitationRecord): Promise<Invitation | null>
    listAll(userId: string): Promise<Invitation[]>
    listPendingByWorkspace(
        workspaceId: string,
        limit?: number,
        offset?: number
    ): Promise<Invitation[]>
    expireStaleInvitations(cutoff: Date): Promise<number>
    isInvitationTokenValid(hashedToken: string): Promise<Invitation | null>
}

export class InvitationRepository implements IInvitationRepository {
    constructor(private db: DatabaseConnection) {}

    // --------------------------------------------
    // Mutation Methods
    // --------------------------------------------
    async create(data: CreateInvitation): Promise<Invitation> {
        const newInvitation = await this.db.insert(invitations).values(data).returning()

        return newInvitation[0]
    }

    async update(id: string, data: Partial<Invitation>): Promise<Invitation> {
        const [updatedInvitation] = await this.db
            .update(invitations)
            .set(data)
            .where(eq(invitations.id, id))
            .returning()

        return updatedInvitation
    }

    async delete(id: string): Promise<Invitation> {
        const [deletedInvitation] = await this.db
            .delete(invitations)
            .where(eq(invitations.id, id))
            .returning()

        return deletedInvitation
    }

    async addMemberAndMarkAccept(data: MarkAcceptRecord): Promise<void> {
        const { invitationId, workspaceId, inviteeUserId, token, permission } = data

        await this.db.transaction(async (tx) => {
            // Add member to workspace
            await tx.insert(workspaceMembers).values({
                userId: inviteeUserId,
                workspaceId: workspaceId,
                permission: permission,
                joinedAt: new Date(),
                updatedAt: new Date()
            })

            // Mark invitation as accepted
            await tx
                .update(invitations)
                .set({
                    status: 'ACCEPTED'
                })
                .where(and(eq(invitations.id, invitationId), eq(invitations.token, token)))
        })
    }

    // --------------------------------------------
    // Query Methods
    // --------------------------------------------
    async getById(id: string): Promise<Invitation | null> {
        const [invitation] = await this.db.select().from(invitations).where(eq(invitations.id, id))

        if (!invitation) return null

        return invitation
    }

    async getByToken(token: string): Promise<Invitation | null> { 
        const [invitation] = await this.db
            .select()
            .from(invitations)
            .where(eq(invitations.token, token))

        if (!invitation) return null

        return invitation
    }

    async getPendingByEmail(data: GetPendingInvitationRecord): Promise<Invitation | null> {
        const [invitation] = await this.db
            .select()
            .from(invitations)
            .where(
                and(
                    eq(invitations.workspaceId, data.workspaceId),
                    eq(invitations.inviteeEmail, data.inviteeEmail),
                    eq(invitations.status, 'PENDING')
                )
            )
            .limit(1)
        if (!invitation) return null

        return invitation
    }

    async listAll(userId: string): Promise<Invitation[]> {
        const allInvitations = await this.db
            .select()
            .from(invitations)
            .where(and(eq(invitations.status, 'PENDING'), eq(invitations.inviterUserId, userId)))

        return allInvitations
    }

    async listPendingByWorkspace(
        workspaceId: string,
        limit?: number,
        offset?: number
    ): Promise<Invitation[]> {
        const invitationsList = await this.db
            .select()
            .from(invitations)
            .where(and(eq(invitations.workspaceId, workspaceId), eq(invitations.status, 'PENDING')))
            .limit(limit ?? 10)
            .offset(offset ?? 0)

        return invitationsList
    }

    async expireStaleInvitations(cutoff: Date): Promise<number> {
        const result = await this.db
            .update(invitations)
            .set({ status: 'EXPIRED' })
            .where(and(eq(invitations.status, 'PENDING'), eq(invitations.expiresAt, cutoff)))
            .returning()
        return result.length
    }

    async isInvitationTokenValid(hashedToken: string): Promise<Invitation | null> {
        const result = await this.db
            .select()
            .from(invitations)
            .where(
                and(
                    eq(invitations.token, hashedToken),
                    eq(invitations.status, 'PENDING'),
                    gt(invitations.expiresAt, new Date())
                )
            )
            .limit(1)

        return result.length > 0 ? result[0] : null
    }
}
