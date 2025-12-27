import { ForbiddenError, NotFoundError } from '@/util'
import { MemberPermission } from '../members'
import { IMemberRepository } from '../members/member.repository'
import { IProjectRepository } from './project.repository'
import {
    ChangeProjectStatusDTO,
    CreateProjectDTO,
    ProjectDTO,
    UpdateProjectDTO
} from './project.types'

export interface IProjectService {
    create(data: CreateProjectDTO): Promise<ProjectDTO>
    update(projectId: string, userId: string, data: UpdateProjectDTO): Promise<void>
    delete(projectId: string, userId: string): Promise<void>
    renameProject(data: { projectId: string; userId: string; newName: string }): Promise<void>
    changeStatus(data: ChangeProjectStatusDTO): Promise<void>
    getById(projectId: string): Promise<ProjectDTO>
    listAll(workspaceId: string): Promise<ProjectDTO[]>
}

export class ProjectService implements IProjectService {
    constructor(
        private readonly projectRepository: IProjectRepository,
        private readonly memberRepository: IMemberRepository
    ) {}

    // ----------------------------------------------------------------------------
    // Mutation Methods
    //----------------------------------------------------------------------------
    async create(data: CreateProjectDTO): Promise<ProjectDTO> {
        // Implementation for creating a project
        const project = await this.projectRepository.create({
            projectName: data.projectName,
            workspaceId: data.workspaceId,
            projectCoverImageUrl: data.projectCoverImageUrl,
            projectOwnerId: data.projectOwnerId
        })

        return project
    }
    async update(projectId: string, userId: string, data: UpdateProjectDTO): Promise<void> {
        const permission: MemberPermission | null =
            await this.memberRepository.getPermissionByUserId(userId)

        // Check if the user has permission to update the project
        if (!permission || (permission !== 'FULL_ACCESS' && permission !== 'EDIT')) {
            throw new Error('User does not have permission to update the project')
        }

        // Proceed to update the project
        await this.projectRepository.update(projectId, data)
    }
    async delete(projectId: string, userId: string): Promise<void> {
        const deletedProject = await this.projectRepository.delete(projectId, userId)

        // Project not found or user does not have permission
        if (!deletedProject) {
            const existingProject = await this.projectRepository.getById(projectId)
            if (!existingProject) {
                throw new NotFoundError('Project not found', 'DELETE_PROJECT_NOT_FOUND')
            }
            throw new ForbiddenError('User does not have permission to delete the project')
        }
    }

    async renameProject(data: {
        projectId: string
        userId: string
        newName: string
    }): Promise<void> {
        // Proceed to rename the project
        const updatedProject = await this.projectRepository.updateName({
            projectId: data.projectId,
            userId: data.userId,
            newName: data.newName
        })

        // Project not found or user does not have permission
        if (!updatedProject) {
            const existingProject = await this.projectRepository.getById(data.projectId)
            if (!existingProject) {
                throw new NotFoundError('Project not found', 'RENAME_PROJECT_NOT_FOUND')
            }

            // Check if the user has permission to rename the project
            const permission: MemberPermission | null =
                await this.memberRepository.getPermissionByUserId(data.userId)
            if (!permission || (permission !== 'FULL_ACCESS' && permission !== 'EDIT')) {
                throw new ForbiddenError('User does not have permission to rename the project')
            }
        }
    }

    async changeStatus(data: ChangeProjectStatusDTO): Promise<void> {
        const permission: MemberPermission | null =
            await this.memberRepository.getPermissionByUserId(data.userId)

        // Check if the user has permission to change the project status
        if (!permission || (permission !== 'FULL_ACCESS' && permission !== 'EDIT')) {
            throw new Error('User does not have permission to change the project status')
        }
        // Proceed to change the project status
        await this.projectRepository.changeStatus({
            projectId: data.projectId,
            status: data.status
        })
    }

    //----------------------------------------------------------------------------
    // Query Methods
    //----------------------------------------------------------------------------
    async getById(projectId: string): Promise<ProjectDTO> {
        const project = await this.projectRepository.getById(projectId)

        if (!project) {
            throw new NotFoundError('Project not found', 'GET_PROJECT_NOT_FOUND')
        }

        return project
    }

    async listAll(workspaceId: string): Promise<ProjectDTO[]> {
        const projects = await this.projectRepository.listAll(workspaceId)

        return projects
    }
}
