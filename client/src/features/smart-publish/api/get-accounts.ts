import { queryOptions, useQuery } from '@tanstack/react-query'

import { SOCIAL_ACCOUNTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { socialAccountKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { Account } from '../types/content'

// Fetches the list of connected social media accounts for a given workspace ID
export const getAccounts = async (workspaceId: string): Promise<Account[]> => {
    const response =  await client.get<Account[]>(`${SOCIAL_ACCOUNTS_API_BASE}/list?workspaceId=${workspaceId}`)
    return response.data
}

// Provides the query options for fetching accounts, which can be used with React Query's useQuery hook
export const getAccountsQueryOptions = (workspaceId: string) => {
    return queryOptions({
        queryKey: socialAccountKeys.all(workspaceId),
        queryFn: () => getAccounts(workspaceId)
    })
}

// Custom hook to fetch accounts using the getAccounts API function and React Query's useQuery hook. It accepts a workspace ID and optional query configuration.
export type UseAccountsOptions = {
    queryConfig?: QueryConfig<typeof getAccountsQueryOptions>
}

// Hook to fetch the list of connected social media accounts for a given workspace ID. It uses the getAccountsQueryOptions to configure the query and accepts additional query configuration through the queryConfig parameter.
export const useAccounts = ({ workspaceId, queryConfig }: UseAccountsOptions & { workspaceId: string }) => {
    return useQuery({
        ...getAccountsQueryOptions(workspaceId),
        ...queryConfig
    })
}
