import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

import type { DraftDTO } from '../types/draft.types'

export const createDraft = async (data: { documentId: string; workspaceId: string }) => {
    const newDocument = await client.post<DraftDTO, null>(`${DOCUMENT_API_BASE}/${data.documentId}/drafts?workspaceId=${data.workspaceId}`, null)

    return newDocument.data
}


type UseCreateDraft = {
    mutationConfig?: MutationConfig<typeof createDraft>
}

export const useCreateDraft = ({ workspaceId, mutationConfig }: UseCreateDraft & { workspaceId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => createDraft(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.lists(workspaceId)
            })
        }
    })
}
