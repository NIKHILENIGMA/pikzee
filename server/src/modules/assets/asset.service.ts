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
    updateAsset(
        userId: string,
        projectId: string,
        assetId: string,
        updateData: { name?: string; folderId?: string | null }
    ): Promise<void>
    updateFolder(
        userId: string,
        projectId: string,
        folderId: string,
        updateData: { name?: string; parentId?: string | null }
    ): Promise<void>
    deleteAsset(userId: string, projectId: string, assetId: string): Promise<void>
    deleteFolder(userId: string, projectId: string, folderId: string): Promise<void>
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
        
        let key, newAsset

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
        const project = await this.projectService.getById(data.projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        const memberExist = await this.memberService.getMemberByUserId(
            project.workspaceId,
            data.userId
        )
        this.validatePermissions(memberExist)

        const subfolders = await this.assetRepository.getSubFolders(data.projectId, data.folderId)
        const assetRecords = await this.assetRepository.getAssetsInFolder(
            data.projectId,
            data.folderId
        )

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

        let breadcrumbs: Array<{ id: string; name: string }> = []

        if (data.folderId) {
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

    async updateAsset(
        userId: string,
        projectId: string,
        assetId: string,
        updateData: { name?: string; folderId?: string | null }
    ): Promise<void> {
        const project = await this.projectService.getById(projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        const memberExist = await this.memberService.getMemberByUserId(project.workspaceId, userId)
        this.validatePermissions(memberExist)

        const asset = await this.assetRepository.getByIdAndProjectId(assetId, projectId)
        if (!asset) throw new NotFoundError('Asset not found')

        if (updateData.folderId !== undefined && updateData.folderId !== null) {
            const targetFolder = await this.assetRepository.getFolderById(updateData.folderId)
            if (!targetFolder || targetFolder.projectId !== projectId) {
                throw new BadRequestError('Invalid target folder')
            }
        }

        await this.assetRepository.update(assetId, updateData)
    }

    async updateFolder(
        userId: string,
        projectId: string,
        folderId: string,
        updateData: { name?: string; parentId?: string | null }
    ): Promise<void> {
        const project = await this.projectService.getById(projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        const memberExist = await this.memberService.getMemberByUserId(project.workspaceId, userId)
        this.validatePermissions(memberExist)

        // Fetch the folder to ensure it exists and belongs to the project
        const folder = await this.assetRepository.getFolderById(folderId)
        if (!folder || folder.projectId !== projectId) throw new NotFoundError('Folder not found')

        // If parentId is being updated, validate the new parent folder
        if (updateData.parentId !== undefined && updateData.parentId !== folder.parentId) {
            if (updateData.parentId === folderId) {
                throw new BadRequestError('Cannot move a folder into itself')
            }
            if (updateData.parentId !== null) {
                const targetFolder = await this.assetRepository.getFolderById(updateData.parentId)
                if (!targetFolder || targetFolder.projectId !== projectId) {
                    throw new BadRequestError('Invalid target folder')
                }
                const isCircular = await this.assetRepository.isDescendant(updateData.parentId, folderId)
                if (isCircular) {
                    throw new BadRequestError('Cannot move a folder into one of its descendants')
                }
            }
        }

        await this.assetRepository.updateFolder(folderId, updateData)
    }

    async deleteAsset(userId: string, projectId: string, assetId: string): Promise<void> {
        const project = await this.projectService.getById(projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        const memberExist = await this.memberService.getMemberByUserId(project.workspaceId, userId)
        this.validatePermissions(memberExist)

        const asset = await this.assetRepository.getByIdAndProjectId(assetId, projectId)
        if (!asset) throw new NotFoundError('Asset not found')

        await this.assetRepository.softDelete(assetId)
    }

    async deleteFolder(userId: string, projectId: string, folderId: string): Promise<void> {
        const project = await this.projectService.getById(projectId)
        if (!project) throw new NotFoundError('Project does not exist')

        const memberExist = await this.memberService.getMemberByUserId(project.workspaceId, userId)
        this.validatePermissions(memberExist)
        

        const folder = await this.assetRepository.getFolderById(folderId)
        if (!folder || folder.projectId !== projectId) throw new NotFoundError('Folder not found')

        await this.assetRepository.softDeleteFolder(folderId)
    }

    private validatePermissions(member: MemberDTO | null) {
        if (!member) throw new BadRequestError('User is not a member of the project workspace')

        const readOnly = ['VIEW_ONLY', 'COMMENT_ONLY']

        if (readOnly.includes(member.permission))
            throw new ForbiddenError('Insufficient permissions to modify assets in this project')
    }
}
