import { useMutation, useQueryClient } from '@tanstack/react-query'

import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { workspaceKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

export const switchWorkspace = async (workspaceId: string) => {
    return await client.post<void, null>(`${WORKSPACE_API_BASE}/${workspaceId}/switch`, null)
}

export type UseSwitchWorkspace = {
    mutationConfig?: MutationConfig<typeof switchWorkspace>
}

/**
 * Hook to switch the current workspace
 *
 * @param workspaceId - The ID of the workspace to switch to
 * @param queryConfig - Optional React Query configuration
 *
 * @returns React Query result for the switch workspace operation
 */
export const useSwitchWorkspace = ({ mutationConfig }: UseSwitchWorkspace = {}) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (id: string) => switchWorkspace(id),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.default()
            })
        }
    })
}
