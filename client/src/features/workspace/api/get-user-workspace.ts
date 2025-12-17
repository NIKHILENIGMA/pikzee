import { queryOptions, useQuery } from '@tanstack/react-query'

import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { WorkspaceDTO } from '../types'

export const getUserWorkspace = async () => {
    return await client.get<WorkspaceDTO>(`${WORKSPACE_API_BASE}/active`)
}

export const getUserWorkspaceQueryOptions = () => {
    return queryOptions({
        queryKey: ['user-workspace'],
        queryFn: () => getUserWorkspace()
    })
}

export type UseUserWorkspaceOptions = {
    queryConfig?: QueryConfig<typeof getUserWorkspaceQueryOptions>
}

/**
 * Hook to fetch the user's active workspace.
 *
 * @param queryConfig - Optional configuration for the query.
 * @returns A React Query object containing the workspace data and query status.
 */
export const useUserWorkspace = ({ queryConfig }: UseUserWorkspaceOptions = {}) => {
    return useQuery({
        ...getUserWorkspaceQueryOptions(),
        ...queryConfig
    })
}
