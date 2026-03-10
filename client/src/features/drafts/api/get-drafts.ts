import { queryOptions, useQuery } from '@tanstack/react-query'

import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { draftKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { DraftDTO } from '../types/draft.types'

export const getDrafts = async (workspaceId: string, docId: string): Promise<DraftDTO[]> => {
    const response = await client.get<DraftDTO[]>(`${DOCUMENT_API_BASE}/${docId}/${DRAFT_API_BASE}?workspaceId=${workspaceId}`)
    return response.data
}

export const getDraftsQueryOptions = (workspaceId: string, docId: string) => {
    return queryOptions({
        queryKey: draftKeys.lists(workspaceId),
        queryFn: () => getDrafts(workspaceId, docId)
    })
}

export type UseDraftsOptions = {
    workspaceId: string
    docId: string
    queryConfig?: QueryConfig<typeof getDraftsQueryOptions>
}

export const useDrafts = ({ workspaceId, docId, queryConfig }: UseDraftsOptions) => {
    return useQuery({
        ...getDraftsQueryOptions(workspaceId, docId),
        ...queryConfig,
        enabled: !!workspaceId
    })
}
