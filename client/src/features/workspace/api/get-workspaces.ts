import { queryOptions, useQuery } from '@tanstack/react-query'

import type { Workspace } from '@/features/dashboard/types'
import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import type { QueryConfig } from '@/shared/lib/react-query'

// Fetches the list of workspaces from the API
export const getWorkspaces = async () => {
    return await client.get<Workspace[]>(WORKSPACE_API_BASE)
}

// Provides the query options for fetching workspaces
export const getWorkspacesQueryOptions = () => {
    return queryOptions({
        queryKey: ['workspaces'],
        queryFn: () => {
            return getWorkspaces()
        }
    })
}

// Custom hook to use the workspaces query with optional configuration
export type UseWorkspacesOptions = {
    queryConfig?: QueryConfig<typeof getWorkspacesQueryOptions>
}

// Hook to fetch workspaces using React Query
export const useWorkspaces = ({ queryConfig }: UseWorkspacesOptions = {}) => {
    return useQuery({
        ...getWorkspacesQueryOptions(),
        ...queryConfig
    })
}
