import { and, eq } from 'drizzle-orm'

import { CreateWorkspaceMember, users, WorkspaceMember, workspaceMembers, workspaces } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'
import { MemberPermission } from './member.types'

type MemberMap = {
    id: string
    userId: string
    permission: 'FULL_ACCESS' | 'VIEW_ONLY' | 'COMMENT_ONLY' | 'EDIT'
    firstName: string | null
    lastName: string | null
    email: string
    avatarUrl: string | null
}

export interface IMemberRepository {
    getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>
    getMemberByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]>
    getMemberWithDetails(workspaceId: string): Promise<MemberMap[]>
    getPermissionByWorkspaceAndUser(
        workspaceId: string,
        userId: string
    ): Promise<{ permission: MemberPermission }>
    getMemberDetailsWithOwner(
        workspaceId: string,
        memberId: string
    ): Promise<MemberWithWorkspaceOwner>
    addMemberByWorkspaceId(data: CreateWorkspaceMember): Promise<WorkspaceMember>
    changeMemberPermission(memberId: string, permission: MemberPermission): Promise<WorkspaceMember>
    removeMemberById(memberId: string): Promise<WorkspaceMember>
}

interface MemberWithWorkspaceOwner {
    workspace: {
        id: string
        name: string
        ownerId: string
    }
    member: {
        id: string
        userId: string
        workspaceId: string
        permission: 'FULL_ACCESS' | 'EDIT' | 'COMMENT_ONLY' | 'VIEW_ONLY'
        joinedAt: Date
    }
}

export class MemberRepository implements IMemberRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async getWorkspaceMembers(workspaceId: string): Promise<any[]> {
        const members = await this.db
            .select({
                id: workspaceMembers.id,
                userId: workspaceMembers.userId,
                workspaceId: workspaceMembers.workspaceId,
                permission: workspaceMembers.permission,
                joinedAt: workspaceMembers.joinedAt,
                // User details
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                avatarUrl: users.avatarUrl
            })
            .from(workspaceMembers)
            .innerJoin(users, eq(users.id, workspaceMembers.userId))
            .where(eq(workspaceMembers.workspaceId, workspaceId))

        return members
    }

    async getMemberByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
        const members = await this.db
            .select()
            .from(workspaceMembers)
            .where(eq(workspaceMembers.workspaceId, workspaceId))

        return members
    }

    async getMemberWithDetails(workspaceId: string): Promise<any[]> {
        const member = await this.db
            .select({
                id: workspaceMembers.id,
                userId: workspaceMembers.userId,
                permission: workspaceMembers.permission,
                // User details
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                avatarUrl: users.avatarUrl
            })
            .from(workspaceMembers)
            .innerJoin(users, eq(users.id, workspaceMembers.userId))
            .where(eq(workspaceMembers.workspaceId, workspaceId))

        return member
    }

    async getPermissionByWorkspaceAndUser(
        workspaceId: string,
        userId: string
    ): Promise<{ permission: MemberPermission }> {
        const [members] = await this.db
            .select({ permission: workspaceMembers.permission })
            .from(workspaceMembers)
            .where(
                and(
                    eq(workspaceMembers.workspaceId, workspaceId),
                    eq(workspaceMembers.userId, userId)
                )
            )
            .limit(1)

        return members
    }

    async getMemberDetailsWithOwner(
        workspaceId: string,
        memberId: string
    ): Promise<MemberWithWorkspaceOwner> {
        const [result] = await this.db
            .select({
                workspace: {
                    id: workspaces.id,
                    name: workspaces.name,
                    ownerId: workspaces.ownerId
                },

                member: {
                    id: workspaceMembers.id,
                    userId: workspaceMembers.userId,
                    workspaceId: workspaceMembers.workspaceId,
                    permission: workspaceMembers.permission,
                    joinedAt: workspaceMembers.joinedAt
                }
            })
            .from(workspaceMembers)
            .innerJoin(workspaces, eq(workspaces.id, workspaceId))
            .where(eq(workspaceMembers.id, memberId))
            .limit(1)

        return result
    }

    async addMemberByWorkspaceId(data: CreateWorkspaceMember): Promise<WorkspaceMember> {
        const [newMember] = await this.db
            .insert(workspaceMembers)
            .values({
                userId: data.userId,
                workspaceId: data.workspaceId,
                permission: data.permission
            })
            .returning({
                id: workspaceMembers.id,
                userId: workspaceMembers.userId,
                workspaceId: workspaceMembers.workspaceId,
                permission: workspaceMembers.permission,
                joinedAt: workspaceMembers.joinedAt,
                updatedAt: workspaceMembers.updatedAt
            })

        return newMember
    }

    async changeMemberPermission(
        memberId: string,
        permission: MemberPermission
    ): Promise<WorkspaceMember> {
        const [updatedPermission] = await this.db
            .update(workspaceMembers)
            .set({ permission: permission, updatedAt: new Date() })
            .where(eq(workspaceMembers.id, memberId))
            .returning()

        return updatedPermission
    }

    async removeMemberById(memberId: string): Promise<WorkspaceMember> {
        const [removedMember] = await this.db
            .delete(workspaceMembers)
            .where(eq(workspaceMembers.id, memberId))
            .returning()

        return removedMember
    }
}
