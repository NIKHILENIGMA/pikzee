import { queryOptions, useQuery } from '@tanstack/react-query'

import { SOCIAL_ACCOUNTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { socialPostKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'


export type SocialPostRecord = {
    id: string
    workspaceId: string
    socialAccountId: string
    platform: string
    title: string
    description: string
    tags: string[] | null
    visibility: string
    platformPostId: string | null
    platformUrl: string | null
    status: string
    errorMessage: string | null
    publishedAt: string | null
    userId: string
    createdAt: string
    updatedAt: string
}

export const getUploadHistory = async (workspaceId: string) => {
    return await client.get<SocialPostRecord[]>(`${SOCIAL_ACCOUNTS_API_BASE}/uploaded`, {
        params: { workspaceId }
    })
}

export const getUploadHistoryQueryOptions = (workspaceId: string) => {
    return queryOptions({
        queryKey: socialPostKeys.list(workspaceId),
        queryFn: () => getUploadHistory(workspaceId)
    })
}

type UseUploadHistoryOptions = {
    workspaceId: string
    queryConfig?: QueryConfig<typeof getUploadHistoryQueryOptions>
}

export const useUploadHistory = ({ workspaceId, queryConfig }: UseUploadHistoryOptions) => {
    return useQuery({
        ...getUploadHistoryQueryOptions(workspaceId),
        ...queryConfig
    })
}
