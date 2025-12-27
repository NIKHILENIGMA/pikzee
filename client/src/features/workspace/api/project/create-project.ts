import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import { PROJECTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { workspaceKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

// Zod schema for project creation
export const createProjectSchema = z.object({
    projectName: z.string().min(1, 'Project name is required'),
    projectCoverImageUrl: z.url().optional(),
    workspaceId: z.string().min(1, 'Workspace ID is required')
})

// Type inferred from the Zod schema
export type CreateProject = z.infer<typeof createProjectSchema>

// API function to create a new project
export const createProject = async (data: CreateProject) => {
    return await client.post<void, CreateProject>(`${PROJECTS_API_BASE}/`, data)
}

// Type for the hook's parameters
type UseCreateProject = {
    mutationConfig?: MutationConfig<typeof createProject>
}

/**
 * Hook for creating workspace invitations.
 *
 * @param mutationConfig - Optional mutation configuration including success callback.
 * @returns React Query mutation object for invitation creation.
 */
export const useCreateProject = ({ mutationConfig }: UseCreateProject = {}) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        ...restConfig,
        mutationFn: (data) => createProject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.default()
            })
        }
    })
}
