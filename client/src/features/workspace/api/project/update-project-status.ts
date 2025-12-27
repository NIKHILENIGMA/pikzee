import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import { PROJECTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { workspaceKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

// Zod schema for invitation creation
export const updateProjectStatusSchema = z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
    projectId: z.string().min(1, 'Project ID is required')
})

// Type inferred from the Zod schema
export type UpdateProjectStatus = z.infer<typeof updateProjectStatusSchema>

//
export const updateProjectStatus = async (data: UpdateProjectStatus) => {
    return await client.patch<void, UpdateProjectStatus>(`${PROJECTS_API_BASE}/${data.projectId}/status`, data)
}

// Type for the hook's parameters
type UseUpdateProjectStatus = {
    mutationConfig?: MutationConfig<typeof updateProjectStatus>
}

/**
 * Hook for updating project status.
 *
 * @param mutationConfig - Optional mutation configuration including success callback.
 * @returns React Query mutation object for project status update.
 */
export const useUpdateProjectStatus = ({ mutationConfig }: UseUpdateProjectStatus = {}) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateProjectStatus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.default()
            })
        }
    })
}
