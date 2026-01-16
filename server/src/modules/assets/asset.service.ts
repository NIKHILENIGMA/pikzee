import { ASSET_UPLOAD_STATUS } from '@/constants/asset.constants'
import { BadRequestError, ForbiddenError, NotFoundError } from '@/util'

import { IMemberService, MemberDTO } from '../members'
import { IProjectService } from '../projects/project.service'

import { IAssetRepository } from './asset.repository'
import { AssetDTO, CreateAssetDTO } from './asset.types'
import { ProjectDTO } from '../projects'

export interface IAssetService {
    create(
        userId: string,
        projectId: string,
        parentAssetId: string | null,
        data: CreateAssetDTO
    ): Promise<AssetDTO>
    delete(userId: string, assetId: string): Promise<void>
    rename(
        userId: string,
        data: { assetId: string; projectId: string; newAssetName: string }
    ): Promise<AssetDTO>
    moveAssets(data: {
        userId: string
        projectId: string
        assetIds: string[]
        targetParentId: string | null
    }): Promise<void>
    copyAssets(data: {
        userId: string
        projectId: string
        assetIds: string[]
        targetParentId: string | null
    }): Promise<void>
    getById(data: { assetId: string; projectId: string }): Promise<AssetDTO>
    listAssetsByParentId(projectId: string, parentAssetId: string | null): Promise<AssetDTO[]>
}

export class AssetService implements IAssetService {
    constructor(
        private readonly assetRepository: IAssetRepository,
        private readonly projectService: IProjectService,
        private readonly memberService: IMemberService
    ) {}
    async create(
        userId: string,
        projectId: string,
        parentAssetId: string | null,
        data: CreateAssetDTO
    ): Promise<AssetDTO> {
        // FAIL FAST: Check the project and permissions user has
        const project = await this.assetPermissionCheck({ userId, projectId })

        // CONTEXT GATHERING: Fetch parent and check for duplicates in parallel
        const [parent, existingAsset] = await Promise.all([
            parentAssetId ? this.assetRepository.getById(parentAssetId) : Promise.resolve(null),
            this.assetRepository.getByNameAndParentId(data.assetName, parentAssetId, projectId)
        ])

        // VALIDATION: Check state
        if (parentAssetId && !parent) throw new NotFoundError('Parent asset does not exist')
        if (parent && parent.projectId !== projectId)
            throw new BadRequestError('Project mismatch for parent asset')
        if (existingAsset)
            throw new BadRequestError(
                'An asset with the same name already exists in the specified folder'
            )

        // CONTEXT BUILDING: Determine path and depth
        const path = parent ? `${parent.path}/${data.assetName}` : `/${data.assetName}`
        const depth = parent ? parent.depth + 1 : 0

        // EXCUTION: Create the new asset record
        return await this.assetRepository.create({
            ...data,
            path,
            depth,
            parentAssetId,
            workspaceId: project.workspaceId,
            projectId,
            uploadStatus: ASSET_UPLOAD_STATUS.COMPLETED,
            createdBy: userId
        })
    }

    async rename(
        userId: string,
        data: { assetId: string; projectId: string; newAssetName: string }
    ): Promise<AssetDTO> {
        // FAIL FAST: Check the project and permissions user has
        await this.assetPermissionCheck({ userId, projectId: data.projectId })

        // FETCH TARGET: We need the target asset to rename
        const targetAsset = await this.assetRepository.getById(data.assetId)
        if (!targetAsset) throw new NotFoundError('Asset does not exist')

        // VALIDATION: Check for name conflicts within the same parent
        if (targetAsset.assetName === data.newAssetName) return targetAsset

        // DATA INTEGRITY: Path Propagation
        const oldPath = targetAsset.path
        const newPath = this.calculateNewPath(oldPath, data.newAssetName)

        // ATOMIC EXCUTION: Perform the rename and path updates in a transaction
        // This ensures that either all changes are applied, or none are, maintaining data integrity
        return await this.assetRepository.transaction<AssetDTO>(async (tx) => {
            // UPDATE TARGET ASSET
            const updatedAsset = await this.assetRepository.updateWithTransaction(
                tx,
                data.assetId,
                {
                    assetName: data.newAssetName,
                    path: newPath
                }
            )

            // UPDATE CHILD ASSET PATHS
            await this.assetRepository.updateChildPaths(tx, oldPath, newPath)

            return updatedAsset
        })
    }

    async moveAssets(data: {
        userId: string
        projectId: string
        assetIds: string[]
        targetParentId: string | null
    }): Promise<void> {
        // FAIL FAST: Check the project and permissions user has
        await this.assetPermissionCheck({ userId: data.userId, projectId: data.projectId })

        // FIND CONTEXT: Get Target Context
        let targetPath: string = ''
        let targetDepth: number = 0

        if (data.targetParentId) {
            const target = await this.assetRepository.getById(data.targetParentId)
            if (!target || target.projectId !== data.projectId)
                throw new NotFoundError('Target folder invalid')
            targetPath = target.path
            targetDepth = target.depth + 1
        }

        // PROCESS: Process each asset in a Transaction
        await this.assetRepository.transaction(async (tx) => {
            // PROCESS EACH ASSET TO MOVE
            for (const assetId of data.assetIds) {
                const asset = await this.assetRepository.getById(assetId)
                if (!asset) continue

                // CONTEXT: Prepare path and depth changes
                const oldPath: string = asset.path
                const newPath: string =
                    data.targetParentId !== null
                        ? `${targetPath}/${asset.assetName}`
                        : `/${asset.assetName}`
                const depthDiff: number = targetDepth - asset.depth

                // VALIDATION: Prevent moving a folder into one of its own subfolders
                if (targetPath.startsWith(oldPath)) {
                    throw new BadRequestError('Cannot move a folder into one of its subfolders')
                }

                // A: Update the asset itself
                await this.assetRepository.updateWithTransaction(tx, assetId, {
                    parentAssetId: data.targetParentId,
                    path: newPath,
                    depth: targetDepth
                })

                // B: Update all children (The "Ripple Effect")
                // We update their paths AND their depths using SQL math
                await this.assetRepository.updateTreePathsAndDepth(tx, oldPath, newPath, depthDiff)
            }
        })
    }

    async copyAssets(data: {
        userId: string
        projectId: string
        assetIds: string[]
        targetParentId: string | null
    }): Promise<void> {
        await this.assetPermissionCheck({ userId: data.userId, projectId: data.projectId })

        // FIND CONTEXT: Get Target Context
        let targetPath: string = ''
        let targetDepth: number = 0

        // If copying into a specific folder, fetch its details
        if (data.targetParentId) {
            const target = await this.assetRepository.getById(data.targetParentId)
            if (!target || target.projectId !== data.projectId)
                throw new NotFoundError('Target folder invalid')
            targetPath = target.path
            targetDepth = target.depth + 1
        }
        
        // IMPLEMENTATION PENDING: Copying assets is a complex operation
        await this.assetRepository.transaction(async (tx) => {
            // PROCESS EACH ASSET TO COPY
            for (const assetId of data.assetIds) {
                const sourceAsset = await this.assetRepository.getById(assetId)
                if (!sourceAsset) continue; // Skip if source asset doesn't exist

                // CONTEXT: Calculate new root details 
                const newRootPath = data.targetParentId !== null ? `${targetPath}/${sourceAsset.assetName}` : `/${sourceAsset.assetName}`
                const depthDiff = targetDepth - sourceAsset.depth

                // Create new asset record as a copy of the source
                const copiedAsset = await this.assetRepository.createWithTransaction(tx, {
                    ...sourceAsset,
                    id: undefined, // Let the database generate a new ID
                    parentAssetId: data.targetParentId,
                    path: newRootPath,
                    depth: targetDepth,
                    createdBy: data.userId
                })

                // DEEP COPY: If the source asset is a folder, we need to copy its entire subtree
                const childrens = await this.assetRepository.getChildrenByPath(sourceAsset.path)

                if (childrens.length > 0) {
                    childrens.map(child => ({
                        ...child,
                        id: undefined, // New ID
                        path: child.path.replace(sourceAsset.path, newRootPath), // Update parent to new copied structure
                        depth: child.depth + depthDiff,
                        workspaceId: copiedAsset.workspaceId,
                        projectId: copiedAsset.projectId,
                        createdBy: data.userId,
                    }))

                    // Bulk create copied children
                    await this.assetRepository.bulkCreateWithTransaction(tx, childrens)
                }
            }
        })

        // This typically involves duplicating the asset records,
        // generating new IDs, and copying any associated files in storage.
        // For now, we leave this as a placeholder.
    }

    async delete(userId: string, assetId: string): Promise<void> {
        // FAIL FAST: Check if asset exists
        const asset = await this.assetRepository.getById(assetId)
        if (!asset) throw new NotFoundError('Asset does not exist')

        // FAIL FAST: Check the project and permissions user has
        const project = await this.projectService.getById(asset.projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        const memberExist = await this.memberService.getMemberByUserId(project.workspaceId, userId)
        this.validatePermissions(memberExist)

        // EXCUTION: Delete the asset
        const deleted = await this.assetRepository.delete(assetId)
        if (!deleted) {
            throw new NotFoundError('Asset to delete not found')
        }
    }

    async listAssetsByParentId(
        projectId: string,
        parentAssetId: string | null
    ): Promise<AssetDTO[]> {
        return this.assetRepository.listAssetsByParentId(parentAssetId, projectId)
    }

    async getById(data: { assetId: string; projectId: string }): Promise<AssetDTO> {
        const asset = await this.assetRepository.getByIdAndProjectId(data.assetId, data.projectId)
        if (!asset) {
            throw new NotFoundError('Asset not found in the specified project')
        }
        return asset
    }

    private async assetPermissionCheck(data: { userId: string; projectId: string }): Promise<ProjectDTO> {
        // FAST FAIL: Permission Check
        const project = await this.projectService.getById(data.projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        const member = await this.memberService.getMemberByUserId(project.workspaceId, data.userId)
        this.validatePermissions(member)
        
        return project
    }

    /**
     * Validates if the member has sufficient permissions to perform asset operations.
     *
     * @param member - The member DTO representing the user's membership in the project workspace
     * @throws {BadRequestError} If the user is not a member of the project workspace
     * @throws {ForbiddenError} If the user has read-only permissions
     *
     * @example
     * // Validating permissions for a member
     * validatePermissions(member)
     * // Throws BadRequestError if member is null
     * // Throws ForbiddenError if member.permission is 'VIEW_ONLY' or 'COMMENT_ONLY'
     */
    private validatePermissions(member: MemberDTO | null) {
        if (!member) throw new BadRequestError('User is not a member of the project workspace')

        const readOnly = ['VIEW_ONLY', 'COMMENT_ONLY']

        if (readOnly.includes(member.permission))
            throw new ForbiddenError('Insufficient permissions to create asset in this project')
    }

    /**
     * Calculates the new path for an asset after renaming.
     *
     * Replaces the last segment of the old path with the new asset name,
     * preserving the directory structure.
     *
     * @param oldPath - The current full path of the asset (e.g., "/folder1/folder2/oldName.txt")
     * @param newAssetName - The new name for the asset (e.g., "newName.txt")
     * @returns The updated path with the new asset name
     *
     * @example
     * // Renaming a file from "oldName.txt" to "newName.txt"
     * calculateNewPath("/folder1/folder2/oldName.txt", "newName.txt")
     * // Returns: "/folder1/folder2/newName.txt"
     */
    private calculateNewPath(oldPath: string, newAssetName: string): string {
        const pathSegments = oldPath.split('/')
        pathSegments[pathSegments.length - 1] = newAssetName
        return pathSegments.join('/')
    }
}

