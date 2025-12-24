import { and, eq } from 'drizzle-orm'

import { DatabaseConnection } from '@/core/db/service/database.service'
import { workspaceMembers, users } from '@/core'

import {
    CreateMemberRecord,
    DeleteMemberRecord,
    MemberDetailRecord,
    MemberDTO,
    MemberRecord,
    UpdatePermissionRecord
} from './member.types'

export interface IMemberRepository {
    create(data: CreateMemberRecord): Promise<MemberRecord>
    update(memberId: string, data: Partial<CreateMemberRecord>): Promise<MemberRecord[]>
    updatePermission(data: UpdatePermissionRecord): Promise<MemberRecord[]>
    delete(data: DeleteMemberRecord): Promise<MemberRecord>
    getById(memberId: string): Promise<MemberRecord | null>
    listAll(workspaceId: string): Promise<MemberDTO[]>
    getMemberDetails(memberId: string): Promise<MemberDetailRecord | null>
    getByWorkspaceIdAndEmail(workspaceId: string, email: string): Promise<MemberRecord | null>
}

export class MemberRepository implements IMemberRepository {
    constructor(private readonly db: DatabaseConnection) {}

    // Create a new workspace member
    async create(data: CreateMemberRecord): Promise<MemberRecord> {
        const [member] = await this.db.insert(workspaceMembers).values(data).returning()

        return member
    }

    // Update workspace member details
    async update(memberId: string, data: Partial<CreateMemberRecord>): Promise<MemberRecord[]> {
        const updatedMember = await this.db
            .update(workspaceMembers)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(eq(workspaceMembers.id, memberId))
            .returning()

        return updatedMember
    }

    // Update workspace member permission
    async updatePermission(data: UpdatePermissionRecord): Promise<MemberRecord[]> {
        const updatedMember = await this.db
            .update(workspaceMembers)
            .set({
                permission: data.permission,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(workspaceMembers.id, data.memberId),
                    eq(workspaceMembers.workspaceId, data.workspaceId),
                    eq(workspaceMembers.permission, 'FULL_ACCESS')
                )
            )
            .returning()

        return updatedMember
    }

    // Delete a workspace member
    async delete(data: DeleteMemberRecord): Promise<MemberRecord> {
        const [deletedMember] = await this.db
            .delete(workspaceMembers)
            .where(
                and(
                    eq(workspaceMembers.workspaceId, data.workspaceId),
                    eq(workspaceMembers.id, data.memberId)
                )
            )
            .returning()

        return deletedMember
    }

    // Get a workspace member by ID
    async getById(memberId: string): Promise<MemberRecord | null> {
        const [member] = await this.db
            .select()
            .from(workspaceMembers)
            .where(eq(workspaceMembers.id, memberId))
            .limit(1)

        return member ? member : null
    }

    // List all members of a workspace
    async listAll(workspaceId: string): Promise<MemberDTO[]> {
        const members = await this.db
            .select({
                id: workspaceMembers.id,
                workspaceId: workspaceMembers.workspaceId,
                permission: workspaceMembers.permission,
                joinedAt: workspaceMembers.joinedAt,
                user: {
                    id: users.id,
                    firstName: users.firstName!,
                    lastName: users.lastName!,
                    email: users.email,
                    avatarUrl: users.avatarUrl
                }
            })
            .from(workspaceMembers)
            .innerJoin(users, eq(users.id, workspaceMembers.userId))
            .where(eq(workspaceMembers.workspaceId, workspaceId))

        return members
    }

    // Get detailed information of a workspace member
    async getMemberDetails(memberId: string): Promise<MemberDetailRecord | null> {
        const [member] = await this.db
            .select({
                id: workspaceMembers.id,
                userId: workspaceMembers.userId,
                permission: workspaceMembers.permission,
                workspaceId: workspaceMembers.workspaceId,
                joinedAt: workspaceMembers.joinedAt,
                updatedAt: workspaceMembers.updatedAt,
                // User details
                firstName: users.firstName || null,
                lastName: users.lastName || null,
                email: users.email,
                avatarUrl: users.avatarUrl || null
            })
            .from(workspaceMembers)
            .innerJoin(users, eq(users.id, workspaceMembers.userId))
            .where(eq(workspaceMembers.id, memberId))
            .limit(1)

        return member || null
    }

    async getByWorkspaceIdAndEmail(
        workspaceId: string,
        email: string
    ): Promise<MemberRecord | null> {
        const [member] = await this.db
            .select()
            .from(workspaceMembers)
            .innerJoin(users, eq(users.id, workspaceMembers.userId))
            .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(users.email, email)))
            .limit(1)

        return member ? member.workspace_members : null
    }
}
