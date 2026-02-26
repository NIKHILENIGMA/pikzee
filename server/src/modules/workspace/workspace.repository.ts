import { and, desc, eq } from 'drizzle-orm'

import { memberPermissionEnum, workspaceMembers, workspaces } from '@/core/db/schema'
import { DatabaseConnection } from '@/core/db/service/database.service'
import { DatabaseError } from '@/util'

import { CreateWorkspaceRecord, SoftDeleteRecord, WorkspaceRecord } from './workspace.types'

export interface IWorkspaceRepository {
    create(data: CreateWorkspaceRecord): Promise<WorkspaceRecord>
    createWorkspaceWithMemberAsAdmin(data: CreateWorkspaceRecord): Promise<WorkspaceRecord>
    update(workspaceId: string, data: Partial<CreateWorkspaceRecord>): Promise<WorkspaceRecord>
    softDelete(data: SoftDeleteRecord): Promise<number>
    getById(workspaceId: string): Promise<WorkspaceRecord | null>
    listAll(userId: string): Promise<WorkspaceRecord[]>
    getActiveWorkspace(userId: string): Promise<WorkspaceRecord | null>
    getMyWorkspace(userId: string): Promise<WorkspaceRecord | null>
}

const [FULL_ACCESS] = memberPermissionEnum.enumValues

export class WorkspaceRepository implements IWorkspaceRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async create(data: CreateWorkspaceRecord): Promise<WorkspaceRecord> {
        const [newWorkspace] = await this.db.insert(workspaces).values(data).returning()

        if (!newWorkspace) {
            throw new DatabaseError('Failed to create new workspace', 'WORKSPACE_CREATION_FAILED')
        }

        return newWorkspace
    }

    async createWorkspaceWithMemberAsAdmin(data: CreateWorkspaceRecord): Promise<WorkspaceRecord> {
        const result = await this.db.transaction(async (tx) => {
            const [newWorkspace] = await tx.insert(workspaces).values(data).returning()

            if (!newWorkspace) {
                throw new DatabaseError(
                    'Failed to create new workspace',
                    'WORKSPACE_CREATION_FAILED'
                )
            }

            // Add owner as member with FULL_ACCESS
            await tx.insert(workspaceMembers).values({
                workspaceId: newWorkspace.id,
                userId: data.ownerId,
                permission: FULL_ACCESS
            })

            return newWorkspace
        })

        return result
    }

    async update(
        workspaceId: string,
        data: Partial<CreateWorkspaceRecord>
    ): Promise<WorkspaceRecord> {
        if (data.ownerId === undefined) {
            throw new DatabaseError(
                'Owner ID is required for updating workspace',
                'WORKSPACE_UPDATE_FAILED'
            )
        }

        const [updatedWorkspace] = await this.db
            .update(workspaces)
            .set({
                name: data.name,
                logoUrl: data.logoUrl,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(workspaces.id, workspaceId),
                    eq(workspaces.ownerId, data.ownerId), // only owner can update
                    eq(workspaces.isDeleted, false)
                )
            )
            .returning()

        return updatedWorkspace
    }

    async softDelete(data: SoftDeleteRecord): Promise<number> {
        const result = await this.db
            .update(workspaces)
            .set({ isDeleted: true, updatedAt: new Date() })
            .where(
                and(
                    eq(workspaces.id, data.workspaceId),
                    eq(workspaces.ownerId, data.ownerId),
                    eq(workspaces.isDeleted, false)
                )
            )
            .returning({ id: workspaces.id })

        return result.length // number of rows affected
    }

    async getById(workspaceId: string): Promise<WorkspaceRecord | null> {
        const [workspace] = await this.db
            .select()
            .from(workspaces)
            .where(and(eq(workspaces.id, workspaceId), eq(workspaces.isDeleted, false)))
            .limit(1) // Ensure only one record is fetched

        if (!workspace) {
            return null
        }

        return workspace
    }

    async listAll(userId: string): Promise<WorkspaceRecord[]> {
        const listWorkspace = await this.db
            .select({
                id: workspaces.id,
                name: workspaces.name,
                logoUrl: workspaces.logoUrl,
                ownerId: workspaces.ownerId,
                subscriptionPlan: workspaces.subscriptionPlan,
                storageUsed: workspaces.storageUsed,
                bandwidthUsed: workspaces.bandwidthUsed,
                createdAt: workspaces.createdAt,
                updatedAt: workspaces.updatedAt,
                isDeleted: workspaces.isDeleted,
                memberId: workspaceMembers.id,

                permission: workspaceMembers.permission,
                joinedAt: workspaceMembers.joinedAt
            })
            .from(workspaceMembers)
            .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
            .where(and(eq(workspaceMembers.userId, userId), eq(workspaces.isDeleted, false)))
            .orderBy(desc(workspaces.createdAt))

        return listWorkspace
    }

    async getMyWorkspace(userId: string): Promise<WorkspaceRecord | null> {
        const [workspace] = await this.db
            .select()
            .from(workspaces)
            .where(and(eq(workspaces.ownerId, userId), eq(workspaces.isDeleted, false)))
            .limit(1)

        return workspace || null
    }

    async getActiveWorkspace(userId: string): Promise<WorkspaceRecord | null> {
        const [workspace] = await this.db
            .select()
            .from(workspaces)
            .where(and(eq(workspaces.ownerId, userId), eq(workspaces.isDeleted, false)))
            .limit(1)

        return workspace || null
    }
}
