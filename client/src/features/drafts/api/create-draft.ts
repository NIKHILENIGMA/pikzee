import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

import type { DraftDTO } from '../types/draft.types'

export const createDraft = async (data: { documentId: string; workspaceId: string }) => {
    const response = await client.post<DraftDTO, null>(`${DOCUMENT_API_BASE}/${data.documentId}/drafts?workspaceId=${data.workspaceId}`, null)

    return response.data
}


type UseCreateDraft = {
    mutationConfig?: MutationConfig<typeof createDraft>
}

export const useCreateDraft = ({ mutationConfig }: UseCreateDraft) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        mutationFn: (data) => createDraft(data),
        onMutate: async (data) => {
            const key = draftKeys.list(data.workspaceId, data.documentId)
            
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: key })
            
            // Snapshot the previous value
            const previousDrafts = queryClient.getQueryData(key)
            
            // Optimistically update to the new value
            queryClient.setQueryData(key, (old: any) => {
                if (!old) return old
                
                return [...old, data]
            })
            
            return { previousDrafts }
        },
        onError: (_, variables, context: any) => {
            const key = draftKeys.list(variables.workspaceId, variables.documentId)
            if (context?.previousDrafts) {
                queryClient.setQueryData(key, context.previousDrafts)
            }
        },
        onSuccess: (_, variables) => {
            const key = draftKeys.list(variables.workspaceId, variables.documentId)
            queryClient.invalidateQueries({ queryKey: key })
        },
        ...restConfig,
    })
}
