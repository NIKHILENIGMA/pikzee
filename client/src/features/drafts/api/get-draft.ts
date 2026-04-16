import { queryOptions, useQuery } from '@tanstack/react-query'

import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { draftKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { DraftDTO } from '../types/draft.types'

export const getDraft = async (data: { workspaceId: string; docId: string; draftId: string }): Promise<DraftDTO> => {
    const { workspaceId, docId, draftId } = data

    // API returns an array for consistency with other endpoints, but we only need the first item since we're querying by ID
    const response = await client.get<DraftDTO>(`${DOCUMENT_API_BASE}/${docId}${DRAFT_API_BASE}/${draftId}?workspaceId=${workspaceId}`)

    return response.data
}

export const getDraftQueryOptions = (workspaceId: string, docId: string, draftId: string) => {
    return queryOptions({
        queryKey: draftKeys.detail(workspaceId, docId, draftId),
        queryFn: () => getDraft({ workspaceId, docId, draftId })
    })
}

export type UseDraftOptions = {
    workspaceId: string
    docId: string
    draftId: string
    queryConfig?: QueryConfig<typeof getDraftQueryOptions>
}

export const useGetDraft = ({ workspaceId, docId, draftId, queryConfig }: UseDraftOptions) => {
    return useQuery({
        ...getDraftQueryOptions(workspaceId, docId, draftId),
        ...queryConfig,
        enabled: !!workspaceId && !!docId && !!draftId
    })
}
