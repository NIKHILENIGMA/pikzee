import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'
import { toast } from 'sonner'

export const deleteDraft = async (data: { documentId: string; workspaceId: string; pageId: string }): Promise<null> => {
    await client.delete<null>(`${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.pageId}?workspaceId=${data.workspaceId}`)

    return null
}

type UseDeleteDraft = {
    mutationConfig?: MutationConfig<typeof deleteDraft>
}

export const useDeleteDraft = ({ mutationConfig }: UseDeleteDraft) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        mutationFn: (data) => deleteDraft(data),
        onMutate: async (data) => {
            const draftKey = draftKeys.detail(data.workspaceId, data.documentId, data.pageId)
            const sidebarKey = draftKeys.list(data.workspaceId, data.documentId)

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: draftKey })
            await queryClient.cancelQueries({ queryKey: sidebarKey })
            // Snapshot the previous value
            const previousDraft = queryClient.getQueryData(draftKey)

            // Optimistically update to the new value
            queryClient.setQueryData(draftKey, () => null)
            queryClient.setQueryData(sidebarKey, (old: any) => {
                if (!old) return old

                return old.filter((draft: any) => draft.id !== data.pageId)
            })

            return { previousDraft }
        },

        onError: (_, variables, context: any) => {
            const draftKey = draftKeys.detail(variables.workspaceId, variables.documentId, variables.pageId)
            const sidebarKey = draftKeys.list(variables.workspaceId, variables.documentId)
            if (context?.previousDraft) {
                queryClient.setQueryData(draftKey, context.previousDraft)
                queryClient.setQueryData(sidebarKey, (old: any) => {
                    if (!old) return old

                    return [...old, context.previousDraft]
                })
            }

            toast.error('Failed to delete draft. Please try again.')
        },
        onSuccess: (_, variables) => {
            const sidebarKey = draftKeys.list(variables.workspaceId, variables.documentId)
            queryClient.invalidateQueries({ queryKey: sidebarKey })
        },
         ...restConfig,
    })
}
