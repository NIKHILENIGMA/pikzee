import z from 'zod'

export const PlanUploadsRequestSchema = z.object({
    files: z
        .array(
            z.object({
                name: z.string().min(1, 'File name is required'),
                size: z.number().min(1, 'File size must be greater than 0'),
                type: z.enum(
                    ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'text/plain'],
                    {
                        message: 'Unsupported file type'
                    }
                )
            })
        )
        .min(1, 'At least one file must be provided'),
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    projectId: z.string().optional()
})
