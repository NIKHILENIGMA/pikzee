import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

export const updateDraftContentSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    content: z.any().optional()
})

export type UpdateDraftContent = z.infer<typeof updateDraftContentSchema>

export const updateDraftContent = async (data: { workspaceId: string; docId: string; draftId: string } & UpdateDraftContent) => {
    const payload: UpdateDraftContent = {}

    if (data.title !== undefined) payload.title = data.title // Only include title if it's provided in the data
    if (data.content !== undefined) payload.content = data.content // Only include content if it's provided in the data

    await client.patch<null, UpdateDraftContent>(
        `${DOCUMENT_API_BASE}/${data.docId}${DRAFT_API_BASE}/${data.draftId}/content?workspaceId=${data.workspaceId}`,
        payload
    )
}

type UseUpdateDraftContent = {
    mutationConfig?: MutationConfig<typeof updateDraftContent>
}

export const useUpdateDraftContent = ({ mutationConfig }: UseUpdateDraftContent) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateDraftContent(data),
        onMutate: async (data) => {
            const draftKey = draftKeys.detail(data.workspaceId, data.docId, data.draftId)
            const sidebarKey = draftKeys.list(data.workspaceId, data.docId)

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: draftKey })
            await queryClient.cancelQueries({ queryKey: sidebarKey })

            // Snapshot the previous value
            const previousDraft = queryClient.getQueryData(draftKey)
            const previousSidebarDrafts = queryClient.getQueryData(sidebarKey)

            // Optimistically update to the new value
            queryClient.setQueryData(
                draftKey,
                (old: any) => {
                    if (!old) return old

                    return {
                        ...old,
                        title: data.title ?? old.title,
                        content: data.content ?? old.content,
                        updatedAt: new Date() // Update the timestamp to reflect the change
                    }
                }
            )

            queryClient.setQueryData(sidebarKey, (old: any) => {
                if (!old) return old

                return old.map((draft: { id: string; title: string | null }) => {
                    if (draft.id !== data.draftId) return draft

                    return {
                        ...draft,
                        title: data.title ?? draft.title
                    }
                })
            })

            // Return context with the previous value to roll back in case of error
            return { previousDraft, previousSidebarDrafts }
        },
        onError: async (_, variables, context) => {
            const draftKey = draftKeys.detail(variables.workspaceId, variables.docId, variables.draftId)
            const sidebarKey = draftKeys.list(variables.workspaceId, variables.docId)

            // Roll back to the previous draft data
            if (context?.previousDraft) {
                queryClient.setQueryData(draftKey, context.previousDraft)
            }

            if (context?.previousSidebarDrafts) {
                queryClient.setQueryData(sidebarKey, context.previousSidebarDrafts)
            }
        },
        // onSettled: (_, __, variables) => {
        //     queryClient.invalidateQueries({
        //         queryKey: draftKeys.detail(variables.workspaceId, variables.docId, variables.draftId)
        //     })

        //     queryClient.invalidateQueries({
        //         queryKey: draftKeys.list(variables.workspaceId, variables.docId)
        //     })
        // }
    })
}
