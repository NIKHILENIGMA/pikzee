import { BadRequestError, ForbiddenError, NotFoundError } from '@/util'
import { AcceptedMimeType } from '@/core'

import { IMemberService, MemberDTO } from '../members'
import { IProjectService } from '../projects/project.service'

import { IAssetRepository } from './asset.repository'

import Uploader from '../uploader/uploader.service'

export interface GetContentsResponse {
    subfolders: {
        id: string
        projectId: string
        parentId: string | null
        name: string
        createdAt: Date
        updatedAt: Date
    }[]
    assets: {
        id: string
        name: string
        status: 'PENDING' | 'READY' | 'FAILED'
        projectId: string
        folderId: string | null
        s3Key: string
        mimeType:
            | 'image/jpeg'
            | 'image/png'
            | 'image/webp'
            | 'video/mp4'
            | 'video/quicktime'
            | 'video/webm'
            | 'application/pdf'
            | 'text/plain'
            | 'audio/mpeg'
            | 'audio/webm'
        sizeBytes: number
        createdAt: Date
        updatedAt: Date
    }[]
    breadcrumbs: {
        id: string
        name: string
    }[]
}

export interface IAssetService {
    createAsset(
        userId: string,
        data: {
            projectId: string
            folderId: string | null
            filename: string
            mimeType: AcceptedMimeType
            sizeBytes: number
        }
    ): Promise<{
        assetId: string
        uploadUrl: string
    }>
    createFolder(
        userId: string,
        data: { projectId: string; parentId: string | null; name: string }
    ): Promise<{ id: string }>
    confirmAssetUpload(assetId: string): Promise<void>
    getFolderContents(data: {
        userId: string
        projectId: string
        folderId: string | null
    }): Promise<GetContentsResponse>
}

export class AssetService implements IAssetService {
    constructor(
        private readonly assetRepository: IAssetRepository,
        private readonly projectService: IProjectService,
        private readonly memberService: IMemberService
    ) {}
    async createAsset(
        userId: string,
        data: {
            projectId: string
            folderId: string | null
            filename: string
            mimeType: AcceptedMimeType
            sizeBytes: number
        }
    ): Promise<{
        assetId: string
        uploadUrl: string
    }> {
        const project = await this.projectService.getById(data.projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        const memberExist = await this.memberService.getMemberByUserId(project.workspaceId, userId)
        this.validatePermissions(memberExist)
        // projects/123/folders/456/uuid-filename.jpg
        let key, newAsset

        // CREATE ASSET RECORD: We create the asset record in the database with status "PENDING"
        if (data.folderId !== null) {
            key = `projects/${data.projectId}/folders/${data.folderId}/${data.filename}`
            newAsset = await this.assetRepository.create({
                projectId: data.projectId,
                folderId: data.folderId,
                name: data.filename,
                mimeType: data.mimeType,
                sizeBytes: data.sizeBytes,
                s3Key: key,
                status: 'PENDING'
            })
        } else {
            key = `projects/${data.projectId}/${data.filename}`
            newAsset = await this.assetRepository.create({
                projectId: data.projectId,
                folderId: data.folderId,
                name: data.filename,
                mimeType: data.mimeType,
                sizeBytes: data.sizeBytes,
                s3Key: key,
                status: 'PENDING'
            })
        }

        // CREATE ASSET RECORD: We create the asset record in the database with status "PENDING"

        // Generate presigned URL for the client to upload the file directly to S3
        const url = await Uploader('S3').getPresignedUrl({
            bucket: 'private',
            key,
            contentType: data.mimeType,
            expiresIn: 900
        })

        return {
            assetId: newAsset.id,
            uploadUrl: url.uploadUrl
        }
    }

    async confirmAssetUpload(assetId: string): Promise<void> {
        await this.assetRepository.update(assetId, {
            status: 'READY',
            updatedAt: new Date()
        })
    }

    async getFolderContents(data: {
        userId: string
        projectId: string
        folderId: string | null
    }): Promise<GetContentsResponse> {
        // FAIL FAST: Check the project and permissions user has
        const project = await this.projectService.getById(data.projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        // Permission Check: We check if the user has permissions to view assets in this project
        const memberExist = await this.memberService.getMemberByUserId(
            project.workspaceId,
            data.userId
        )
        this.validatePermissions(memberExist)

        // Fetch Subfolders
        const subfolders = await this.assetRepository.getSubFolders(data.projectId, data.folderId)

        // Fetch Assets
        const assetRecords = await this.assetRepository.getAssetsInFolder(data.projectId, data.folderId)

        // Generate Presigned URLs for each asset
        const assets = await Promise.all(
            assetRecords.map(async (asset) => {
                const assetUrl = await Uploader('S3').getPresignedGetUrl({
                    bucket: 'private',
                    key: asset.s3Key,
                    expiresIn: 3600 // 1 hour
                })
                return {
                    ...asset,
                    assetUrl
                }
            })
        )

        // 3. Fetch Breadcrumbs (Recursive CTE)
        let breadcrumbs: Array<{ id: string; name: string }> = []

        if (data.folderId) {
            // This query walks UP the tree from the current folder to the root
            breadcrumbs = await this.assetRepository.getBreadcrumbs(data.folderId)
        }

        return {
            subfolders,
            assets,
            breadcrumbs
        }
    }

    async createFolder(
        userId: string,
        data: { projectId: string; parentId: string | null; name: string }
    ): Promise<{ id: string }> {
        const project = await this.projectService.getById(data.projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        const memberExist = await this.memberService.getMemberByUserId(project.workspaceId, userId)
        this.validatePermissions(memberExist)

        return await this.assetRepository.createFolder({
            projectId: data.projectId,
            parentId: data.parentId,
            name: data.name
        })
    }

    // async rename(
    //     userId: string,
    //     data: { assetId: string; projectId: string; newAssetName: string }
    // ): Promise<AssetDTO> {
    //     // FAIL FAST: Check the project and permissions user has
    //     await this.assetPermissionCheck({ userId, projectId: data.projectId })

    //     // FETCH TARGET: We need the target asset to rename
    //     const targetAsset = await this.assetRepository.getById(data.assetId)
    //     if (!targetAsset) throw new NotFoundError('Asset does not exist')

    //     // VALIDATION: Check for name conflicts within the same parent
    //     if (targetAsset.assetName === data.newAssetName) return targetAsset

    //     // DATA INTEGRITY: Path Propagation
    //     const oldPath = targetAsset.path
    //     const newPath = this.calculateNewPath(oldPath, data.newAssetName)

    //     // ATOMIC EXCUTION: Perform the rename and path updates in a transaction
    //     // This ensures that either all changes are applied, or none are, maintaining data integrity
    //     return await this.assetRepository.transaction<AssetDTO>(async (tx) => {
    //         // UPDATE TARGET ASSET
    //         const updatedAsset = await this.assetRepository.updateWithTransaction(
    //             tx,
    //             data.assetId,
    //             {
    //                 assetName: data.newAssetName,
    //                 path: newPath
    //             }
    //         )

    //         // UPDATE CHILD ASSET PATHS
    //         await this.assetRepository.updateChildPaths(tx, oldPath, newPath)

    //         return updatedAsset
    //     })
    // }

    // async moveAssets(data: {
    //     userId: string
    //     projectId: string
    //     assetIds: string[]
    //     targetParentId: string | null
    // }): Promise<void> {
    //     // FAIL FAST: Check the project and permissions user has
    //     await this.assetPermissionCheck({ userId: data.userId, projectId: data.projectId })

    //     // FIND CONTEXT: Get Target Context
    //     let targetPath: string = ''
    //     let targetDepth: number = 0

    //     if (data.targetParentId) {
    //         const target = await this.assetRepository.getById(data.targetParentId)
    //         if (!target || target.projectId !== data.projectId)
    //             throw new NotFoundError('Target folder invalid')
    //         targetPath = target.path
    //         targetDepth = target.depth + 1
    //     }

    //     // PROCESS: Process each asset in a Transaction
    //     await this.assetRepository.transaction(async (tx) => {
    //         // PROCESS EACH ASSET TO MOVE
    //         for (const assetId of data.assetIds) {
    //             const asset = await this.assetRepository.getById(assetId)
    //             if (!asset) continue

    //             // CONTEXT: Prepare path and depth changes
    //             const oldPath: string = asset.path
    //             const newPath: string =
    //                 data.targetParentId !== null
    //                     ? `${targetPath}/${asset.assetName}`
    //                     : `/${asset.assetName}`
    //             const depthDiff: number = targetDepth - asset.depth

    //             // VALIDATION: Prevent moving a folder into one of its own subfolders
    //             if (targetPath.startsWith(oldPath)) {
    //                 throw new BadRequestError('Cannot move a folder into one of its subfolders')
    //             }

    //             // A: Update the asset itself
    //             await this.assetRepository.updateWithTransaction(tx, assetId, {
    //                 parentAssetId: data.targetParentId,
    //                 path: newPath,
    //                 depth: targetDepth
    //             })

    //             // B: Update all children (The "Ripple Effect")
    //             // We update their paths AND their depths using SQL math
    //             await this.assetRepository.updateTreePathsAndDepth(tx, oldPath, newPath, depthDiff)
    //         }
    //     })
    // }

    // async copyAssets(data: {
    //     userId: string
    //     projectId: string
    //     assetIds: string[]
    //     targetParentId: string | null
    // }): Promise<void> {
    //     await this.assetPermissionCheck({ userId: data.userId, projectId: data.projectId })

    //     // FIND CONTEXT: Get Target Context
    //     let targetPath: string = ''
    //     let targetDepth: number = 0

    //     // If copying into a specific folder, fetch its details
    //     if (data.targetParentId) {
    //         const target = await this.assetRepository.getById(data.targetParentId)
    //         if (!target || target.projectId !== data.projectId)
    //             throw new NotFoundError('Target folder invalid')
    //         targetPath = target.path
    //         targetDepth = target.depth + 1
    //     }

    //     // IMPLEMENTATION PENDING: Copying assets is a complex operation
    //     await this.assetRepository.transaction(async (tx) => {
    //         // PROCESS EACH ASSET TO COPY
    //         for (const assetId of data.assetIds) {
    //             const sourceAsset = await this.assetRepository.getById(assetId)
    //             if (!sourceAsset) continue // Skip if source asset doesn't exist

    //             // CONTEXT: Calculate new root details
    //             const newRootPath =
    //                 data.targetParentId !== null
    //                     ? `${targetPath}/${sourceAsset.assetName}`
    //                     : `/${sourceAsset.assetName}`
    //             const depthDiff = targetDepth - sourceAsset.depth

    //             // Create new asset record as a copy of the source
    //             const copiedAsset = await this.assetRepository.createWithTransaction(tx, {
    //                 ...sourceAsset,
    //                 id: undefined, // Let the database generate a new ID
    //                 parentAssetId: data.targetParentId,
    //                 path: newRootPath,
    //                 depth: targetDepth,
    //                 createdBy: data.userId
    //             })

    //             // DEEP COPY: If the source asset is a folder, we need to copy its entire subtree
    //             const childrens = await this.assetRepository.getChildrenByPath(sourceAsset.path)

    //             if (childrens.length > 0) {
    //                 childrens.map((child) => ({
    //                     ...child,
    //                     id: undefined, // New ID
    //                     path: child.path.replace(sourceAsset.path, newRootPath), // Update parent to new copied structure
    //                     depth: child.depth + depthDiff,
    //                     workspaceId: copiedAsset.workspaceId,
    //                     projectId: copiedAsset.projectId,
    //                     createdBy: data.userId
    //                 }))

    //                 // Bulk create copied children
    //                 await this.assetRepository.bulkCreateWithTransaction(tx, childrens)
    //             }
    //         }
    //     })

    //     // This typically involves duplicating the asset records,
    //     // generating new IDs, and copying any associated files in storage.
    //     // For now, we leave this as a placeholder.
    // }

    // async delete(userId: string, assetId: string): Promise<void> {
    //     // FAIL FAST: Check if asset exists
    //     const asset = await this.assetRepository.getById(assetId)
    //     if (!asset) throw new NotFoundError('Asset does not exist')

    //     // FAIL FAST: Check the project and permissions user has
    //     const project = await this.projectService.getById(asset.projectId)
    //     if (!project) throw new NotFoundError('Project does not exist')

    //     const memberExist = await this.memberService.getMemberByUserId(project.workspaceId, userId)
    //     this.validatePermissions(memberExist)

    //     // EXCUTION: Delete the asset
    //     const deleted = await this.assetRepository.delete(assetId)
    //     if (!deleted) {
    //         throw new NotFoundError('Asset to delete not found')
    //     }
    // }

    // private async assetPermissionCheck(data: {
    //     userId: string
    //     projectId: string
    // }): Promise<ProjectDTO> {
    //     // FAST FAIL: Permission Check
    //     const project = await this.projectService.getById(data.projectId)
    //     if (!project) throw new NotFoundError('Project does not exist')

    //     const member = await this.memberService.getMemberByUserId(project.workspaceId, data.userId)
    //     this.validatePermissions(member)

    //     return project
    // }

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
    // private calculateNewPath(oldPath: string, newAssetName: string): string {
    //     const pathSegments = oldPath.split('/')
    //     pathSegments[pathSegments.length - 1] = newAssetName
    //     return pathSegments.join('/')
    // }
}
