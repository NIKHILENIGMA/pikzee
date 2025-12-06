import { CreateWorkspace } from '@/core'
import { DatabaseError, ForbiddenError, NotFoundError } from '@/util'

import { IUserService } from '../user'
import { IMemberService } from '../members/member.service'

import { IWorkspaceRepository } from './workspace.repository'
import {
    WorkspaceDTO,
    CreateWorkspaceDTO,
    UpdateWorkspaceDTO,
    SoftDeleteDTO
} from './workspace.types'

type MemberMap = {
    id: string
    userId: string
    permission: 'FULL_ACCESS' | 'VIEW_ONLY' | 'COMMENT_ONLY' | 'EDIT'
    firstName: string | null
    lastName: string | null
    email: string
    avatarUrl: string | null
}

export interface IWorkspaceService {
    create(data: CreateWorkspaceDTO): Promise<WorkspaceDTO>
    createWorkspaceWithOwnerPermission(data: CreateWorkspaceDTO): Promise<WorkspaceDTO>
    update(workspaceId: string, data: UpdateWorkspaceDTO): Promise<WorkspaceDTO>
    softDelete(data: SoftDeleteDTO): Promise<string>
    getById(workspaceId: string, userId: string): Promise<WorkspaceDTO>
    listAll(userId: string): Promise<WorkspaceDTO[]>
}

export class WorkspaceService implements IWorkspaceService {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly memberServicer: IMemberService,
        private readonly userService: IUserService
    ) {}

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

    // ------------------------------------------
    // QUERY METHODS
    // ------------------------------------------
    async listAll(userId: string): Promise<WorkspaceDTO[]> {
        return await this.workspaceRepository.listAll(userId)
    }

    async getById(workspaceId: string, userId: string): Promise<WorkspaceDTO> {
        const [workspaceDetails, workspaceMemberDetails] = await Promise.all([
            // Fetch workspace details
            this.workspaceRepository.getById(workspaceId),
            // Fetch workspace members
            this.memberServicer.getMemberWithDetails(workspaceId)
        ])

        // Validate workspace existence
        if (!workspaceDetails) {
            // Workspace not found or is deleted
            throw new NotFoundError('Workspace not found', 'workspaceService.getWorkspaceById')
        }

        // Map members for easy access
        const memberMap = new Map<string, MemberMap>( //todo: optimize type
            workspaceMemberDetails.map((wm) => [wm.userId, wm])
        )

        // Verify caller is a member
        const callerMember = memberMap.get(userId)
        if (!callerMember) {
            throw new ForbiddenError(
                'Access to workspace forbidden',
                'workspaceService.getWorkspaceById'
            )
        }

        // Get owner details
        const owner = memberMap.get(workspaceDetails.ownerId)
        if (!owner) {
            throw new DatabaseError(
                'Workspace owner not found among members',
                'workspaceService.getWorkspaceById'
            )
        }

        // todo: fetch projects list when implemented
        return {
            id: workspaceDetails.id,
            name: workspaceDetails.name,
            logoUrl: workspaceDetails.logoUrl,
            ownerId: workspaceDetails.ownerId,
            createdAt: workspaceDetails.createdAt,
            members: workspaceMemberDetails.map((wm) => ({
                id: wm.id,
                firstName: wm.firstName || '',
                lastName: wm.lastName || '',
                email: wm.email,
                avatarUrl: wm.avatarUrl || null,
                permission: wm.permission
            })),
            projects: []
        }
    }

    // ------------------------------------------
    // MUTATION METHODS
    // ------------------------------------------

    // Create a new workspace
    async create(data: CreateWorkspace): Promise<WorkspaceDTO> {
        // Check user should exist in database
        const user = await this.userService.getUserById(data.ownerId)
        if (!user) {
            throw new NotFoundError('User not found', 'workspaceService.createWorkspace')
        }

        // Create workspace with owner
        const workspace = await this.workspaceRepository.create(data)
        if (!workspace) {
            throw new NotFoundError('Workspace creation failed', 'workspaceService.createWorkspace')
        }

        // Return workspace DTO
        return {
            id: workspace.id,
            name: workspace.name,
            logoUrl: workspace.logoUrl,
            ownerId: workspace.ownerId,
            createdAt: workspace.createdAt
        }
    }

    async createWorkspaceWithOwnerPermission(data: CreateWorkspace): Promise<WorkspaceDTO> {
        // Create workspace
        const user = await this.userService.getUserById(data.ownerId)
        if (!user) {
            throw new NotFoundError('User not found', 'workspaceService.createWorkspace')
        }

        // Create workspace with owner
        const workspace = await this.workspaceRepository.createWorkspaceWithMemberAsAdmin(data)
        if (!workspace) {
            throw new NotFoundError('Workspace creation failed', 'workspaceService.createWorkspace')
        }

        // Return workspace DTO
        return {
            id: workspace.id,
            name: workspace.name,
            logoUrl: workspace.logoUrl,
            ownerId: workspace.ownerId,
            createdAt: workspace.createdAt
        }
    }

    // Update existing workspace
    async update(workspaceId: string, data: UpdateWorkspaceDTO): Promise<WorkspaceDTO> {
        // If workspace exist then update
        const workspace = await this.workspaceRepository.update(workspaceId, data)

        if (!workspace) {
            // if update failed, check if workspace exists
            const existingWorkspace = await this.workspaceRepository.getById(workspaceId)

            if (!existingWorkspace || existingWorkspace.isDeleted === true) {
                throw new NotFoundError('Workspace not found', 'workspaceService.updateWorkspace')
            }

            throw new ForbiddenError(
                'Only workspace owner can update workspace',
                'workspaceService.updateWorkspace'
            )
        }

        return workspace
    }

    // Soft delete workspace
    async softDelete(data: SoftDeleteDTO): Promise<string> {
        const rowsAffected: number = await this.workspaceRepository.softDelete({
            workspaceId: data.workspaceId,
            ownerId: data.userId
        })

        // If no rows affected, check if workspace exists or if user is not owner
        if (rowsAffected === 0) {
            // Check if workspace exists
            const workspace = await this.workspaceRepository.getById(data.workspaceId)
            if (!workspace) {
                throw new NotFoundError('Workspace not found', 'workspaceService.deleteWorkspace')
            } else {
                // User is not the owner
                throw new ForbiddenError(
                    'Only workspace owner can delete workspace',
                    'workspaceService.deleteWorkspace'
                )
            }
        }

        return 'Workspace deleted successfully'
    }
}
