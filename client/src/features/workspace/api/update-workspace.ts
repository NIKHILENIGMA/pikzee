import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import client from '@/shared/lib/api-client'
import type { MutationConfig } from '@/shared/lib/react-query'

import type { WorkspaceDTO } from '../types'

// Schema for updating a workspace
export const UpdateWorkspaceSchema = z.object({
    name: z.string().min(1, 'Workspace name is required')
})

export type UpdateWorkspace = z.infer<typeof UpdateWorkspaceSchema>

// Function to update a workspace by its ID
export const updateWorkspace = async ({ workspaceId, data }: { workspaceId: string; data: UpdateWorkspace }) => {
    return await client.patch<WorkspaceDTO, UpdateWorkspace>(`/workspaces/${workspaceId}`, data)
}

type UseUpdateWorkspaceOptions = {
    mutationConfig?: MutationConfig<typeof updateWorkspace>
}

/**
 * Hook for updating a workspace
 *
 * @param {UseUpdateWorkspaceOptions} param0 - Configuration options for the mutation
 * @param {MutationConfig<typeof updateWorkspace>} [param0.mutationConfig] - Optional mutation configuration
 * @returns {UseMutationResult<WorkspaceDTO, Error, { workspaceId: string; data: UpdateWorkspace }, unknown>} Mutation object with update workspace functionality
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateWorkspace({
 *   mutationConfig: {
 *     onSuccess: (data) => {
 *       console.log('Workspace updated:', data)
 *     }
 *   }
 * })
 *
 * const handleUpdate = () => {
 *   mutate({ workspaceId: '123', data: { name: 'New Workspace' } })
 * }
 * ```
 */
export const useUpdateWorkspace = ({ mutationConfig }: UseUpdateWorkspaceOptions = {}) => {
    const queryClient = useQueryClient()

    const { onSuccess, ...restConfig } = mutationConfig || {}
    return useMutation({
        onSuccess: (data, ...args) => {
            queryClient.refetchQueries({
                queryKey: ['workspaces']
            })
            onSuccess?.(data, ...args)
        },
        ...restConfig,
        mutationFn: updateWorkspace
    })
}
