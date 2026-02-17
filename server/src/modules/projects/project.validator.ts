import z from 'zod'

export const CreateProjectSchema = z.object({
    projectName: z.string().min(1, 'Project name is required'),
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    projectOwnerId: z.string().min(1, 'Project owner ID is required'),
    projectCoverImageUrl: z.url().optional()
})

export const UpdateProjectSchema = z.object({
    projectName: z.string().min(1, 'Project name is required').optional(),
    projectCoverImageUrl: z.url().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
    isAccessRestricted: z.boolean().optional()
})

export const ChangeProjectStatusSchema = z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
    projectId: z.string().min(1, 'Project ID is required')
})

export const RenameProjectSchema = z.object({
    newName: z.string().min(1, 'New project name is required')
})

export const GetProjectSchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required')
})

export const ProjectIdParamSchema = z.object({
    projectId: z.string().min(1, 'Project ID is required')
})
