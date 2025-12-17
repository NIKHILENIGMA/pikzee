import { queryOptions, useQuery } from '@tanstack/react-query'

import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { workspaceKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { WorkspaceDTO } from '../types'

// Fetches a specific workspace by its ID from the API
export const getWorkspace = async (workspaceId: string) => {
    return await client.get<WorkspaceDTO>(`${WORKSPACE_API_BASE}/${workspaceId}`)
}

// Provides the query options for fetching a specific workspace
export const getWorkspaceQueryOptions = (workspaceId: string) => {
    return queryOptions({
        queryKey: [workspaceKeys.detail(workspaceId)],
        queryFn: () => getWorkspace(workspaceId)
    })
}

// Type for options to use in the useWorkspace hook
export type UseWorkspaceOptions = {
    workspaceId: string
    queryConfig?: QueryConfig<typeof getWorkspaceQueryOptions>
}

/**
 *  Custom hook to fetch a specific workspace using React Query
 *
 * @param {UseWorkspaceOptions} options - Options including workspaceId and optional queryConfig
 * @returns {ReturnType<typeof useQuery>} - The result of the useQuery hook for the workspace
 *
 */
export const useWorkspace = ({ workspaceId, queryConfig }: UseWorkspaceOptions) => {
    return useQuery({
        ...getWorkspaceQueryOptions(workspaceId),
        ...queryConfig
    })
}
