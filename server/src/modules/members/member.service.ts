import { db, users, workspaceMembers, workspaces } from '@/core'
import { and, eq } from 'drizzle-orm'
import { MemberDTO, MemberPermission, UpdateMemberPermissionInput, InsertMember } from './member.types'
import { DatabaseError, ForbiddenError, StandardError } from '@/util'

export class MemberService {
    private static instance: MemberService

    constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static getInstance(): MemberService {
        if (!MemberService.instance) {
            MemberService.instance = new MemberService()
        }
        return MemberService.instance
    }

    async getWorkspaceMembers(workspaceId: string): Promise<MemberDTO[]> {
        const members = await db
            .select({
                id: workspaceMembers.id,
                userId: workspaceMembers.userId,
                workspaceId: workspaceMembers.workspaceId,
                permission: workspaceMembers.permission,
                joinedAt: workspaceMembers.joinedAt,

                // User info
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                avatarUrl: users.avatarUrl
            })
            .from(workspaceMembers)
            .innerJoin(users, eq(workspaceMembers.userId, users.id))
            .where(eq(workspaceMembers.workspaceId, workspaceId))

        return members.map((member) => ({
            id: member.id,
            userId: member.userId,
            workspaceId: member.workspaceId,
            permission: member.permission,
            joinedAt: member.joinedAt,
            user: {
                id: member.userId,
                name: member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : member.firstName || member.lastName,
                email: member.email,
                avatarUrl: member.avatarUrl
            }
        }))
    }

    async addMemberToWorkspace(data: InsertMember): Promise<MemberDTO> {
        try {
            const [newMember] = await db
                .insert(workspaceMembers)
                .values({
                    userId: data.inviteeUserId,
                    workspaceId: data.workspaceId,
                    permission: data.permission
                })
                .returning({
                    id: workspaceMembers.id,
                    userId: workspaceMembers.userId,
                    workspaceId: workspaceMembers.workspaceId,
                    permission: workspaceMembers.permission,
                    joinedAt: workspaceMembers.joinedAt
                })

            if (!newMember) {
                throw new DatabaseError('Failed to insert new member record.', 'MemberService.addMemberToWorkspace')
            }

            return newMember
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new DatabaseError(`Failed to add member to workspace: ${(error as Error).message}`, 'MemberService.addMemberToWorkspace')
        }
    }

    async updateMemberPermission(workspaceId: string, memberId: string, requesterId: string, data: UpdateMemberPermissionInput): Promise<MemberDTO> {
        const [requesterCheck, targetDetails] = await Promise.all([
            db
                .select({ permission: workspaceMembers.permission })
                .from(workspaceMembers)
                .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, requesterId)))
                .limit(1),
            db
                .select({
                    ownerId: workspaces.ownerId,

                    targetUserId: workspaceMembers.userId,
                    targetId: workspaceMembers.id,
                    targetWorkspaceId: workspaceMembers.workspaceId // To verify membership
                })
                .from(workspaceMembers)
                .innerJoin(workspaces, eq(workspaces.id, workspaceId))
                .where(eq(workspaceMembers.id, memberId))
                .limit(1)
        ])

        const requesterMember = requesterCheck[0] // Requester's membership details
        const targetMember = targetDetails[0] // Target member's details

        if (!requesterMember || requesterMember.permission !== 'FULL_ACCESS') {
            throw new ForbiddenError('Not a member of the workspace or insufficient permissions.')
        }

        if (!targetMember || targetMember.targetWorkspaceId !== workspaceId) {
            throw new ForbiddenError('Target member does not belong to the specified workspace.')
        }

        // 2. Prevent changing owner's permission
        if (targetMember.targetUserId === targetMember.ownerId) {
            throw new ForbiddenError('Cannot change permission of the workspace owner.')
        }

        const [updatedMember] = await db
            .update(workspaceMembers)
            .set({ permission: data.permission, updatedAt: new Date() })
            .where(eq(workspaceMembers.id, memberId))
            .returning()

        return updatedMember
    }

    async removeMemberFromWorkspace(workspaceId: string, memberId: string, requesterId: string) {
        const [requesterCheck, targetDetails] = await Promise.all([
            db
                .select({ permission: workspaceMembers.permission })
                .from(workspaceMembers)
                .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, requesterId)))
                .limit(1),
            db
                .select({
                    targetUserId: workspaceMembers.userId,
                    targetId: workspaceMembers.id,
                    ownerId: workspaces.ownerId,
                    targetWorkspaceId: workspaceMembers.workspaceId // To verify membership
                })
                .from(workspaceMembers)
                .innerJoin(workspaces, eq(workspaces.id, workspaceId))
                .where(eq(workspaceMembers.id, memberId))
                .limit(1)
        ])

        const requesterMember = requesterCheck[0] // Requester's membership details
        const targetMember = targetDetails[0] // Target member's details

        // 1. Verify requester is a member
        if (!requesterMember || requesterMember.permission !== 'FULL_ACCESS') {
            throw new ForbiddenError('Not a member of the workspace or insufficient permissions.')
        }

        if (!targetMember || targetMember.targetWorkspaceId !== workspaceId) {
            throw new ForbiddenError('Target member does not belong to the specified workspace.')
        }

        // 2. Prevent removing owner
        if (targetMember.targetUserId === targetMember.ownerId) {
            throw new ForbiddenError('Cannot remove workspace owner.')
        }

        await db.delete(workspaceMembers).where(eq(workspaceMembers.id, memberId))

        return { message: 'Member removed successfully.' }
    }

    async checkMemberPermission(workspaceId: string, userId: string): Promise<{ permission: MemberPermission }> {
        const memberRecord = await db
            .select({ permission: workspaceMembers.permission })
            .from(workspaceMembers)
            .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
            .limit(1)

        if (memberRecord.length === 0) {
            throw new ForbiddenError('Not a member of the workspace.')
        }

        return memberRecord[0]
    }

    async isMemberOfWorkspace(workspaceId: string, userId: string): Promise<boolean> {
        const memberRecord = await db
            .select()
            .from(workspaceMembers)
            .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
            .limit(1)

        return memberRecord.length > 0
    }
}

export const memberService = MemberService.getInstance()
