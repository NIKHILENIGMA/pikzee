import { projects } from '@/core'
import { DatabaseConnection } from '@/core/db/service/database.service'
import { NewProjectRecord, ProjectRecord } from './project.types'
import { and, desc, eq } from 'drizzle-orm'

export interface IProjectRepository {
    create(data: NewProjectRecord): Promise<ProjectRecord>
    update(projectId: string, data: Partial<ProjectRecord>): Promise<void>
    delete(projectId: string): Promise<void>
    updateName(record: {
        projectId: string
        userId: string
        newName: string
    }): Promise<ProjectRecord | null>
    getById(projectId: string): Promise<ProjectRecord | null>
    listAll(workspaceId: string): Promise<ProjectRecord[]>
}

export class ProjectRepository implements IProjectRepository {
    constructor(private readonly db: DatabaseConnection) {}

    async create(data: NewProjectRecord): Promise<ProjectRecord> {
        const [project] = await this.db.insert(projects).values(data).returning()

        return project
    }

    async update(projectId: string, data: Partial<ProjectRecord>): Promise<void> {
        await this.db.update(projects).set(data).where(eq(projects.id, projectId))
    }

    async delete(projectId: string): Promise<void> {
        await this.db.delete(projects).where(eq(projects.id, projectId))
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

    async getById(projectId: string): Promise<ProjectRecord | null> {
        const project = await this.db
            .select()
            .from(projects)
            .where(eq(projects.id, projectId))
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
