import z from 'zod'

export const GetUserDetailsByIdSchema = z.object({
    id: z.string().min(1, { message: 'User ID is required' })
})

export const UpdateUserDetailsSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }).optional(),
    lastName: z.string().min(1, { message: 'Last name is required' }).optional(),
    email: z.email({ message: 'Invalid email address' }).optional(),
    avatarUrl: z.url({ message: 'Invalid URL' }).optional(),
    isActive: z.boolean().optional(),
    lastActiveWorkspaceId: z.string().optional()
})