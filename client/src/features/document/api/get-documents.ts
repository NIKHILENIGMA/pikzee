import { queryOptions, useQuery } from '@tanstack/react-query'

import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { documentKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { DocumentDTO } from '../types'

export const getDocuments = async (workspaceId: string) => {
    return await client.get<DocumentDTO[]>(`${WORKSPACE_API_BASE}/${workspaceId}/documents`)
}

export const getDocumentsQueryOptions = (workspaceId: string) => {
    return queryOptions({
        queryKey: documentKeys.lists(workspaceId),
        queryFn: () => getDocuments(workspaceId)
    })
}

export type UseDocumentsOptions = {
    workspaceId: string
    queryConfig?: QueryConfig<typeof getDocumentsQueryOptions>
}

export const useDocuments = ({ workspaceId, queryConfig }: UseDocumentsOptions) => {
    return useQuery({
        ...getDocumentsQueryOptions(workspaceId),
        ...queryConfig,
        enabled: !!workspaceId
    })
}
