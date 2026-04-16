import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'
import z from 'zod'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'
import type { DraftSidebarDTO } from '../types/draft.types'

//
const UpdateEmojiSchema = z.object({
    icon: z.string({ message: 'Invalid emoji or icon' }).or(z.null())
})

export type UpdateEmojiDTO = z.infer<typeof UpdateEmojiSchema>

/**
 * Updates the emoji for a specific draft
 * @param data - An object containing the documentId, draftId, workspaceId, and the new emoji icon
 */
export const updateEmoji = async (data: { documentId: string; draftId: string; workspaceId: string } & UpdateEmojiDTO) => {
    await client.patch<null, UpdateEmojiDTO>(
        `${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.draftId}/emoji?workspaceId=${data.workspaceId}`,
        {
            icon: data.icon
        }
    )
}

type UseUpdateEmoji = {
    mutationConfig?: MutationConfig<typeof updateEmoji>
}

/**
 * Custom hook to update the emoji of a draft with optimistic updates and error handling
 * @param workspaceId - The ID of the workspace
 * @param documentId - The ID of the document
 * @param draftId - The ID of the draft
 * @param mutationConfig - Optional configuration for the mutation
 * @returns A mutation object from react-query to trigger the emoji update
 */
export const useUpdateEmoji = ({ mutationConfig }: UseUpdateEmoji) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateEmoji(data),
        
        onMutate: async (variable) => {
            const key = draftKeys.detail(variable.workspaceId, variable.documentId, variable.draftId)
            const sidebarKey = draftKeys.list(variable.workspaceId, variable.documentId)
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({
                queryKey: key
            })

            await queryClient.cancelQueries({
                queryKey: sidebarKey
            })

            // Snapshot the previous value
            const previousDraft = queryClient.getQueryData(key)
            const previousSidebarDrafts = queryClient.getQueryData(sidebarKey)

            // Optimistically update to the new value
            queryClient.setQueryData(key, (old) => {
                if (!old) return old

                return {
                    ...old,
                    icon: variable.icon
                }
            })

            // Also update the list of drafts in the sidebar to reflect the new emoji
            queryClient.setQueryData(sidebarKey, (old: DraftSidebarDTO[] | undefined) => {
                if (!old) return old

                return old.map((draft) => {
                    if (draft.id === variable.draftId) {
                        return {
                            ...draft,
                            icon: variable.icon
                        }
                    }
                    return draft
                })
            })

            // Return a context object with the snapshotted value
            return { previousDraft, previousSidebarDrafts }
        },

        onError: (_, data, context) => {
            const key = draftKeys.detail(data.workspaceId, data.documentId, data.draftId)
            const sidebarKey = draftKeys.list(data.workspaceId, data.documentId)
            // Roll back to the previous value
            queryClient.setQueryData(key, context?.previousDraft)
            queryClient.setQueryData(sidebarKey, context?.previousSidebarDrafts)

            // Show error toast
            toast.error('Failed to update emoji. Please try again.')
        }
    })
}
