import { projects } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'
import { NewProjectRecord, ProjectRecord } from './project.types'
import { and, desc, eq } from 'drizzle-orm'

export interface IProjectRepository {
    create(data: NewProjectRecord): Promise<ProjectRecord>
    update(projectId: string, data: Partial<ProjectRecord>): Promise<ProjectRecord | null>
    delete(projectId: string, userId: string): Promise<ProjectRecord | null>
    softDelete(projectId: string, userId: string): Promise<ProjectRecord | null>
    updateName(record: {
        projectId: string
        userId: string
        newName: string
    }): Promise<ProjectRecord | null>
    changeStatus(record: {
        projectId: string
        status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    }): Promise<void>
    getById(projectId: string): Promise<ProjectRecord | null>
    listAll(workspaceId: string): Promise<ProjectRecord[]>
}

export class ProjectRepository implements IProjectRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async create(data: NewProjectRecord): Promise<ProjectRecord> {
        const [project] = await this.db.insert(projects).values(data).returning()

        return project
    }

    async update(projectId: string, data: Partial<ProjectRecord>): Promise<ProjectRecord | null> {
        const updatedRecord = await this.db
            .update(projects)
            .set(data)
            .where(
                and(
                    eq(projects.id, projectId),
                    eq(projects.isDeleted, false)
                )
            )
            .returning()
        return updatedRecord.length > 0 ? updatedRecord[0] : null
    }

    async delete(projectId: string, userId: string): Promise<ProjectRecord | null> {
        const [deletedProject] = await this.db
            .delete(projects)
            .where(
                and(
                    eq(projects.id, projectId),
                    eq(projects.projectOwnerId, userId),
                    eq(projects.isDeleted, false)
                )
            )
            .returning()
        return deletedProject || null
    }

    async softDelete(projectId: string, userId: string): Promise<ProjectRecord | null> {
        const updatedRecord = await this.db
            .update(projects)
            .set({ isDeleted: true })
            .where(
                and(
                    eq(projects.id, projectId),
                    eq(projects.projectOwnerId, userId),
                    eq(projects.isDeleted, false)
                )
            )
            .returning()
        return updatedRecord.length > 0 ? updatedRecord[0] : null
    }

    async updateName(record: {
        projectId: string
        userId: string
        newName: string
    }): Promise<ProjectRecord | null> {
        const result = await this.db
            .update(projects)
            .set({ projectName: record.newName })
            .where(
                and(
                    eq(projects.id, record.projectId),
                    eq(projects.isDeleted, false),
                    eq(projects.projectOwnerId, record.userId)
                )
            )
            .returning()
        return result.length > 0 ? result[0] : null
    }

    async changeStatus(record: {
        projectId: string
        status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    }): Promise<void> {
        await this.db
            .update(projects)
            .set({ status: record.status })
            .where(eq(projects.id, record.projectId))
    }

    async getById(projectId: string): Promise<ProjectRecord | null> {
        const project = await this.db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.id, projectId),
                    eq(projects.isDeleted, false)
                )
            )
            .limit(1)

        return project.length > 0 ? project[0] : null
    }

    async listAll(workspaceId: string): Promise<ProjectRecord[]> {
        const projectList = await this.db
            .select()
            .from(projects)
            .where(and(eq(projects.workspaceId, workspaceId), eq(projects.isDeleted, false)))
            .orderBy(desc(projects.createdAt))

        return projectList
    }
}
