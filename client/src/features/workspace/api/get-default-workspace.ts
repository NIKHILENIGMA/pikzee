import { queryOptions, useQuery } from '@tanstack/react-query'

import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { workspaceKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { WorkspaceDTO } from '../types'

// Fetches a specific workspace by its ID from the API
export const getDefaultWorkspace = async () => {
    return await client.get<WorkspaceDTO>(`${WORKSPACE_API_BASE}/me`)
}

// Provides the query options for fetching a specific workspace
export const getDefaultWorkspaceQueryOptions = () => {
    return queryOptions({
        queryKey: workspaceKeys.default(),
        queryFn: () => getDefaultWorkspace()
    })
}

// Type for options to use in the useWorkspace hook
export type UseDefaultWorkspaceOptions = {
    queryConfig?: QueryConfig<typeof getDefaultWorkspaceQueryOptions>
}

/**
 *  Custom hook to fetch a specific workspace using React Query
 *
 * @param {UseWorkspaceOptions} options - Options including optional queryConfig
 * @returns {ReturnType<typeof useQuery>} - The result of the useQuery hook for the workspace
 *
 */
export const useDefaultWorkspace = ({ queryConfig }: UseDefaultWorkspaceOptions) => {
    return useQuery({
        ...getDefaultWorkspaceQueryOptions(),
        ...queryConfig
    })
}
