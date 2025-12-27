import { queryOptions, useQuery } from '@tanstack/react-query'

import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { memberKeys } from '@/shared/lib/query-keys'
import type { QueryConfig } from '@/shared/lib/react-query'

import type { MemberDTO } from '../types'

export const getMembers = async (workspaceId: string) => {
    return await client.get<MemberDTO[]>(`${WORKSPACE_API_BASE}/${workspaceId}/members`)
}

export const getMembersQueryOptions = (workspaceId: string) => {
    return queryOptions({
        queryKey: memberKeys.lists(workspaceId),
        queryFn: () => getMembers(workspaceId)
    })
}

type UseMembersOptions = {
    workspaceId: string
    queryConfig?: QueryConfig<typeof getMembersQueryOptions>
}

export const useGetMembers = ({ workspaceId, queryConfig }: UseMembersOptions) => {
    return useQuery({
        ...getMembersQueryOptions(workspaceId),
        ...queryConfig
    })
}
