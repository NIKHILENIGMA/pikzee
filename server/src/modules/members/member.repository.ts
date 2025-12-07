import { and, eq } from 'drizzle-orm'

import { DatabaseConnection } from '@/core/db/service/database.service'
import { workspaceMembers } from '@/core/db/schema/workspace.schema'
import { users } from '@/core/db/schema/users.schema'

import {
    CreateMemberRecord,
    DeleteMemberRecord,
    MemberDetailRecord,
    MemberRecord,
    UpdateMemberPermissionDTO
} from './member.types'

export interface IMemberRepository {
    create(data: CreateMemberRecord): Promise<MemberRecord>
    update(memberId: string, data: Partial<CreateMemberRecord>): Promise<MemberRecord[]>
    updatePermission(data: UpdateMemberPermissionDTO): Promise<MemberRecord[]>
    delete(data: DeleteMemberRecord): Promise<MemberRecord>
    getById(memberId: string): Promise<MemberRecord | null>
    listAll(workspaceId: string): Promise<MemberRecord[]>
    getMemberDetails(memberId: string): Promise<MemberDetailRecord | null>
}

// interface MemberWithWorkspaceOwner {
//     workspace: {
//         id: string
//         name: string
//         ownerId: string
//     }
//     member: {
//         id: string
//         userId: string
//         workspaceId: string
//         permission: 'FULL_ACCESS' | 'EDIT' | 'COMMENT_ONLY' | 'VIEW_ONLY'
//         joinedAt: Date
//     }
// }

export class MemberRepository implements IMemberRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async create(data: CreateMemberRecord): Promise<MemberRecord> {
        const [member] = await this.db.insert(workspaceMembers).values(data).returning()

        return member
    }

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

    async updatePermission(data: UpdateMemberPermissionDTO): Promise<MemberRecord[]> {
        const updatedMember = await this.db
            .update(workspaceMembers)
            .set({
                permission: data.permission,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(workspaceMembers.id, data.memberId),
                    eq(workspaceMembers.workspaceId, data.workspaceId)
                )
            )
            .returning()

        return updatedMember
    }

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

    async getById(memberId: string): Promise<MemberRecord | null> {
        const [member] = await this.db
            .select()
            .from(workspaceMembers)
            .where(eq(workspaceMembers.id, memberId))
            .limit(1)

        return member ? member : null
    }

    async listAll(workspaceId: string): Promise<MemberRecord[]> {
        return await this.db
            .select()
            .from(workspaceMembers)
            .where(eq(workspaceMembers.workspaceId, workspaceId))
    }

    async getMemberDetails(memberId: string): Promise<MemberDetailRecord | null> {
        const [member] = await this.db
            .select({
                id: workspaceMembers.id,
                userId: workspaceMembers.userId,
                permission: workspaceMembers.permission,
                workspaceId: workspaceMembers.workspaceId,
                joinedAt: workspaceMembers.joinedAt,
                updatedAt: workspaceMembers.updatedAt,
                // Flatten user details
                firstName: users.firstName || null,
                lastName: users.lastName || null,
                email: users.email!,
                avatarUrl: users.avatarUrl || null
            })
            .from(workspaceMembers)
            .innerJoin(users, eq(users.id, workspaceMembers.userId))
            .where(eq(workspaceMembers.id, memberId))
            .limit(1)

        return member || null
    }
}
