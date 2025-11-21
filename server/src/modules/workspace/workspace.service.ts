import { CreateWorkspace, db, users, workspaceMembers, workspaces } from '@/core'
import {
    UpdateWorkspaceInput,
    SubscriptionLimits,
    WorkspaceDTO,
    WorkspaceUsageDTO,
    UpdateStorageUsageResult,
    UpdateBandwidthUsageResult,
    UpdatedWorkspaceDTO
} from './workspace.types'
import { and, desc, eq } from 'drizzle-orm'
import { BadRequestError, DatabaseError, ForbiddenError, NotFoundError, StandardError } from '@/util'
import { logger } from '@/config'

type MemberMap = {
    id: string
    userId: string
    permission: 'FULL_ACCESS' | 'VIEW_ONLY' | 'COMMENT_ONLY' | 'EDIT'
    firstName: string | null
    lastName: string | null
    email: string
    avatarUrl: string | null
}

export class WorkspaceService {
    private static instance: WorkspaceService

    constructor() {}

    public static getInstance(): WorkspaceService {
        if (!WorkspaceService.instance) {
            WorkspaceService.instance = new WorkspaceService()
        }
        return WorkspaceService.instance
    }

    getSubscriptionLimits(plan: string): SubscriptionLimits {
        /**
         * TASK LIST:
         * 1. Check Redis cache for subscription plan limits using key `subscription:${plan}`
         * 2. If cache hit, parse and return limits
         * 3. If cache miss, define limits based on plan type:
         *    - free: 1 workspace, 2 members, 2 projects, 500MB storage, 1GB bandwidth, 10 docs, [youtube]
         *    - creator: 1 workspace, 5 members, 5 projects, 10GB storage, 15GB bandwidth, 25 docs, [youtube, linkedin, twitter]
         *    - team: 5 workspaces, 10 members, 10 projects, 25GB storage, 40GB bandwidth, unlimited docs, all platforms
         * 4. Store limits in Redis with 24h expiry
         * 5. Return subscription limits object
         */
        // todo: implement Redis caching for subscription limits
        switch (plan) {
            case 'FREE':
                return {
                    maxMembers: 2,
                    maxProjects: 2,
                    storageLimit: 500 * 1024 * 1024, // 500MB
                    bandwidthLimit: 1 * 1024 * 1024 * 1024, // 1GB
                    maxDocuments: 10,
                    allowedPlatforms: ['youtube']
                }
            case 'CREATOR':
                return {
                    maxMembers: 5,
                    maxProjects: 5,
                    storageLimit: 10 * 1024 * 1024 * 1024, // 10GB
                    bandwidthLimit: 15 * 1024 * 1024 * 1024, // 15GB
                    maxDocuments: 25,
                    allowedPlatforms: ['youtube', 'linkedin', 'twitter']
                }
            case 'TEAM':
                return {
                    maxMembers: 10,
                    maxProjects: 10,
                    storageLimit: 25 * 1024 * 1024 * 1024, // 25GB
                    bandwidthLimit: 40 * 1024 * 1024 * 1024, // 40GB
                    maxDocuments: Infinity,
                    allowedPlatforms: ['youtube', 'linkedin', 'twitter', 'facebook', 'instagram']
                }
            default:
                throw new BadRequestError('Invalid subscription plan', 'workspaceService.getSubscriptionLimits')
        }
    }

    async getUserWorkspaces(userId: string): Promise<WorkspaceDTO[]> {
        const workspacesList = await db
            .select({
                workspaces: {
                    id: workspaces.id,
                    name: workspaces.name,
                    logoUrl: workspaces.logoUrl,
                    createdAt: workspaces.createdAt
                },
                owner: {
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    email: users.email,
                    avatarUrl: users.avatarUrl
                }
            })
            .from(workspaces)
            .innerJoin(workspaceMembers, and(eq(workspaceMembers.workspaceId, workspaces.id), eq(workspaceMembers.userId, userId)))
            .innerJoin(users, eq(users.id, workspaces.ownerId))
            .where(eq(workspaces.isDeleted, false))
            .orderBy(desc(workspaces.createdAt))

        return workspacesList.map((ws) => ({
            id: ws.workspaces.id,
            name: ws.workspaces.name,
            logoUrl: ws.workspaces.logoUrl,
            createdAt: ws.workspaces.createdAt,
            owner: {
                id: ws.owner.id,
                firstName: ws.owner.firstName || null,
                lastName: ws.owner.lastName || null,
                email: ws.owner.email,
                avatarUrl: ws.owner.avatarUrl || null
            }
        }))
    }

    async getWorkspaceById(workspaceId: string, userId: string): Promise<WorkspaceDTO> {
        const [workspaceQuery, workspaceMemberQuery] = await Promise.all([
            db
                .select()
                .from(workspaces)
                .where(and(eq(workspaces.id, workspaceId), eq(workspaces.isDeleted, false)))
                .limit(1),

            db
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
        ])

        // Validate workspace existence
        const workspace = workspaceQuery[0]
        if (!workspace) {
            // Workspace not found or is deleted
            throw new NotFoundError('Workspace not found', 'workspaceService.getWorkspaceById')
        }

        // Map members for easy access
        const memberMap = new Map<string, MemberMap>(workspaceMemberQuery.map((wm) => [wm.userId, wm]))
        // Verify caller is a member
        const callerMember = memberMap.get(userId)

        if (!callerMember) {
            throw new ForbiddenError('Access to workspace forbidden', 'workspaceService.getWorkspaceById')
        }

        // Get owner details
        const owner = memberMap.get(workspace.ownerId)
        if (!owner) {
            throw new DatabaseError('Workspace owner not found among members', 'workspaceService.getWorkspaceById')
        }

        // todo: fetch projects list when implemented
        return {
            id: workspace.id,
            name: workspace.name,
            logoUrl: workspace.logoUrl,
            subscriptionPlan: workspace.subscriptionPlan,
            storageUsed: workspace.storageUsed,
            bandwidthUsed: workspace.bandwidthUsed,
            createdAt: workspace.createdAt,
            members: workspaceMemberQuery.map((wm) => ({
                id: wm.id,
                firstName: wm.firstName || '',
                lastName: wm.lastName || '',
                email: wm.email,
                avatarUrl: wm.avatarUrl || null,
                permission: wm.permission
            })),
            owner: {
                id: owner.id,
                firstName: owner.firstName || null,
                lastName: owner.lastName || null,
                email: owner.email,
                avatarUrl: owner.avatarUrl || null
            },
            projects: []
        }
    }

    async createWorkspace(data: CreateWorkspace): Promise<WorkspaceDTO> {
        try {
            const workspace = await db.transaction(async (tx) => {
                const user = await tx.select().from(users).where(eq(users.id, data.ownerId)).limit(1)
                if (user.length === 0) {
                    throw new NotFoundError('User not found', 'workspaceService.createWorkspace')
                }
                const [newWorkspace] = await tx
                    .insert(workspaces)
                    .values({
                        name: data.name,
                        logoUrl: data.logoUrl,
                        ownerId: data.ownerId,
                        isDeleted: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                    .returning({
                        id: workspaces.id,
                        name: workspaces.name,
                        logoUrl: workspaces.logoUrl,
                        ownerId: workspaces.ownerId,
                        subscriptionPlan: workspaces.subscriptionPlan,
                        createdAt: workspaces.createdAt
                    })

                if (!newWorkspace) {
                    throw new DatabaseError('Failed to create workspace', 'workspaceService.createWorkspace')
                }

                const [newMember] = await tx
                    .insert(workspaceMembers)
                    .values({
                        workspaceId: newWorkspace.id,
                        userId: data.ownerId,
                        permission: 'FULL_ACCESS',
                        joinedAt: new Date()
                    })
                    .returning()
                if (!newMember) {
                    throw new DatabaseError('Failed to add workspace member', 'workspaceService.createWorkspace')
                }

                return newWorkspace
            })

            return {
                id: workspace.id,
                name: workspace.name,
                logoUrl: workspace.logoUrl,
                subscriptionPlan: workspace.subscriptionPlan,
                createdAt: workspace.createdAt
            }
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }

            throw new DatabaseError(`Transaction failed: ${(error as Error).message}`, 'workspaceService.createWorkspace')
        }
    }

    async updateWorkspace(workspaceId: string, userId: string, data: UpdateWorkspaceInput): Promise<UpdatedWorkspaceDTO> {
        try {
            const workspace = await db
                .update(workspaces)
                .set({
                    name: data.name,
                    logoUrl: data.logoUrl,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(workspaces.id, workspaceId),
                        eq(workspaces.ownerId, userId), // only owner can update
                        eq(workspaces.isDeleted, false)
                    )
                )
                .returning({ id: workspaces.id, name: workspaces.name, logoUrl: workspaces.logoUrl, updatedAt: workspaces.updatedAt })

            if (workspace.length === 0) {
                const [existingWorkspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).limit(1)

                if (!existingWorkspace || existingWorkspace.isDeleted) {
                    throw new NotFoundError('Workspace not found', 'workspaceService.updateWorkspace')
                }

                throw new ForbiddenError('Only workspace owner can update workspace', 'workspaceService.updateWorkspace')
            }

            return workspace[0]
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }
            throw new DatabaseError(`Failed to update workspace: ${(error as Error).message}`, 'workspaceService.updateWorkspace')
        }
    }

    async deleteWorkspace(workspaceId: string, userId: string): Promise<void> {
        try {
            const [workspace] = await db
                .select()
                .from(workspaces)
                .where(and(eq(workspaces.id, workspaceId), eq(workspaces.isDeleted, false)))
            if (!workspace) {
                throw new NotFoundError('Workspace not found', 'workspaceService.deleteWorkspace')
            }

            const isOwner: boolean = workspace?.ownerId === userId
            if (!isOwner) {
                throw new ForbiddenError('Only workspace owner can delete workspace', 'workspaceService.deleteWorkspace')
            }

            const activeWorkspaceCount = await db
                .select()
                .from(workspaces)
                .where(and(eq(workspaces.ownerId, userId), eq(workspaces.isDeleted, false)))

            if (activeWorkspaceCount.length <= 1) {
                throw new BadRequestError('Cannot delete the last active workspace', 'workspaceService.deleteWorkspace')
            }

            await db
                .update(workspaces)
                .set({
                    isDeleted: true,
                    updatedAt: new Date()
                })
                .where(eq(workspaces.id, workspaceId))
        } catch (error) {
            if (error instanceof StandardError) {
                throw error
            }
            throw new DatabaseError(`Failed to delete workspace: ${(error as Error).message}`, 'workspaceService.deleteWorkspace')
        }
    }

    async getWorkspaceUsage(workspaceId: string, userId: string): Promise<WorkspaceUsageDTO> {
        const [workspaceQuery, workspaceMembersQuery] = await Promise.all([
            db
                .select()
                .from(workspaces)
                .where(and(eq(workspaces.id, workspaceId), eq(workspaces.isDeleted, false))),
            db.select().from(workspaceMembers).where(eq(workspaceMembers.workspaceId, workspaceId))
        ])

        const workspace = workspaceQuery[0]
        if (!workspace) {
            throw new NotFoundError('Workspace not found', 'workspaceService.getWorkspaceUsage')
        }

        const isMember = workspaceMembersQuery.some((wm) => wm.userId === userId)
        if (!isMember) {
            throw new ForbiddenError('Access to workspace forbidden', 'workspaceService.getWorkspaceUsage')
        }

        const subscriptionPlan = workspace.subscriptionPlan || 'FREE'
        const limits = this.getSubscriptionLimits(subscriptionPlan)

        return {
            storageUsed: workspace.storageUsed || 0,
            storageLimit: limits.storageLimit,
            bandwidthUsed: workspace.bandwidthUsed || 0,
            bandwidthLimit: limits.bandwidthLimit,
            memberCount: workspaceMembersQuery.length,
            memberLimit: limits.maxMembers,
            projectCount: 0, // todo: implement project count when projects are added
            projectLimit: limits.maxProjects
        }
    }

    async updateStorageUsage(workspaceId: string, bytesAdded: number): Promise<UpdateStorageUsageResult> {
        const result = await db.transaction(async (tx) => {
            const [workspace] = await tx
                .select()
                .from(workspaces)
                .where(and(eq(workspaces.id, workspaceId), eq(workspaces.isDeleted, false)))
            if (!workspace) {
                throw new NotFoundError('Workspace not found', 'workspaceService.updateStorageUsage')
            }

            // Calculate new storage used
            const newStorageUsed = Math.max(0, (workspace.storageUsed || 0) + bytesAdded)

            // Get subscription limits
            const limits = this.getSubscriptionLimits(workspace.subscriptionPlan || 'FREE')

            // Check against storage limit
            if (newStorageUsed > limits.storageLimit) {
                throw new BadRequestError('Storage limit exceeded', 'workspaceService.updateStorageUsage')
            }

            await tx
                .update(workspaces)
                .set({
                    storageUsed: newStorageUsed,
                    updatedAt: new Date()
                })
                .where(eq(workspaces.id, workspaceId))

            return { newStorageUsed }
        })

        return {
            workspaceId,
            newStorageUsed: result.newStorageUsed,
            bytesAdded
        }
    }

    async updateBandwidthUsage(workspaceId: string, bytesTransferred: number): Promise<UpdateBandwidthUsageResult> {
        const bandwidth = await db.transaction(async (tx) => {
            const [workspace] = await tx
                .select()
                .from(workspaces)
                .where(and(eq(workspaces.id, workspaceId), eq(workspaces.isDeleted, false)))

            if (!workspace) {
                throw new NotFoundError('Workspace not found', 'workspaceService.updateBandwidthUsage')
            }

            // Calculate new bandwidth used
            const newBandwidthUsed = (workspace.bandwidthUsed || 0) + bytesTransferred

            // Get subscription limits
            const limits = this.getSubscriptionLimits(workspace.subscriptionPlan || 'FREE')

            // For free plan, block if exceeds limit
            if (newBandwidthUsed > limits.bandwidthLimit && workspace.subscriptionPlan === 'FREE') {
                throw new BadRequestError('Bandwidth limit exceeded for free plan', 'workspaceService.updateBandwidthUsage')
            }

            await tx
                .update(workspaces)
                .set({
                    bandwidthUsed: newBandwidthUsed,
                    updatedAt: new Date()
                })
                .where(eq(workspaces.id, workspaceId))

            // For paid plans, just log if exceeds limit
            if (newBandwidthUsed > limits.bandwidthLimit) {
                logger.warn(`Workspace ${workspaceId} has exceeded its bandwidth limit.`)
            }

            return { newBandwidthUsed }
        })

        return {
            workspaceId,
            newBandwidthUsed: bandwidth.newBandwidthUsed,
            bytesTransferred
        }
    }
}

export const workspaceService = WorkspaceService.getInstance()
