import { queryOptions, useQuery } from '@tanstack/react-query'

import { DOCUMENT_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { draftKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { DraftSidebarDTO } from '../types/draft.types'

export const getSidebarDrafts = async (workspaceId: string, docId: string): Promise<DraftSidebarDTO[]> => {
    const response = await client.get<DraftSidebarDTO[]>(`${DOCUMENT_API_BASE}/${docId}/drafts/sidebar?workspaceId=${workspaceId}`)
    return response.data
}

export const getSidebarDraftsQueryOptions = (workspaceId: string, docId: string) => {
    return queryOptions({
        queryKey: draftKeys.lists(workspaceId),
        queryFn: () => getSidebarDrafts(workspaceId, docId)
    })
}

export type UseSidebarDraftOptions = {
    workspaceId: string
    docId: string
    queryConfig?: QueryConfig<typeof getSidebarDraftsQueryOptions>
}

export const useSidebar = ({ workspaceId, docId, queryConfig }: UseSidebarDraftOptions) => {
    return useQuery({
        ...getSidebarDraftsQueryOptions(workspaceId, docId),
        ...queryConfig,
        enabled: !!workspaceId,
    })
}
