import { queryOptions, useQuery } from '@tanstack/react-query'

import { ASSETS_API_BASE, PROJECTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import type { QueryConfig } from '@/shared/lib/react-query'
import type { GetContentsResponse } from '../types/assets'

export const getContent = async (projectId: string, folderId: string | null): Promise<GetContentsResponse> => {
    const response = await client.get<GetContentsResponse>(`${PROJECTS_API_BASE}/${projectId}${ASSETS_API_BASE}?folderId=${folderId}`)
    return response.data
}

export const getContentQueryOptions = (projectId: string, folderId: string | null) => {
    return queryOptions({
        queryKey: ['folder-contents', projectId, folderId],
        queryFn: () => getContent(projectId, folderId)
    })
}

export type UseContentOptions = {
    queryConfig?: QueryConfig<typeof getContentQueryOptions>
}

export const useContent = ({ projectId, folderId, queryConfig }: UseContentOptions & { projectId: string; folderId: string | null }) => {
    return useQuery({
        ...getContentQueryOptions(projectId, folderId),
        ...queryConfig
    })
}
