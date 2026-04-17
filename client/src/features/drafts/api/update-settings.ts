import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'
import type { DraftDTO } from '../types/draft.types'

export const updateDraftSettingsSchema = z.object({
    fontStyle: z.enum(['sans', 'serif', 'mono']).optional(),
    fontSize: z.enum(['16px', '25px', '36px']).optional(),
    isFullWidth: z.boolean().optional(),
    showCover: z.boolean().optional(),
    showIcon: z.boolean().optional(),
    showOwner: z.boolean().optional(),
    showLastModified: z.boolean().optional()
})

export type UpdateDraftSettings = z.infer<typeof updateDraftSettingsSchema>

export const updateDraftSettings = async (data: { workspaceId: string; docId: string; draftId: string } & UpdateDraftSettings) => {
    await client.patch<null, UpdateDraftSettings>(
        `${DOCUMENT_API_BASE}/${data.docId}${DRAFT_API_BASE}/${data.draftId}/settings?workspaceId=${data.workspaceId}`,
        {
            fontStyle: data.fontStyle,
            fontSize: data.fontSize,
            isFullWidth: data.isFullWidth,
            showCover: data.showCover,
            showIcon: data.showIcon,
            showOwner: data.showOwner,
            showLastModified: data.showLastModified
        }
    )
}

type UseUpdateDraftSettings = {
    mutationConfig?: MutationConfig<typeof updateDraftSettings>
}

export const useUpdateDraftSettings = ({ mutationConfig }: UseUpdateDraftSettings) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        mutationFn: (data) => updateDraftSettings(data),
        onMutate: async (data) => {
            const key = draftKeys.detail(data.workspaceId, data.docId, data.draftId)

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: key })

            // Snapshot the previous value
            const previousDraft = queryClient.getQueryData(key)

            // Optimistically update to the new value
            queryClient.setQueryData(
                key,
                (old: DraftDTO | undefined) => {
                    if (!old) return old

                    return {
                        ...old,
                        settings: {
                            ...(old.settings || {}),
                            fontStyle: data.fontStyle ?? old.settings?.fontStyle,
                            fontSize: data.fontSize ?? old.settings?.fontSize,
                            isFullWidth: data.isFullWidth ?? old.settings?.isFullWidth,
                            showCover: data.showCover ?? old.settings?.showCover,
                            showIcon: data.showIcon ?? old.settings?.showIcon,
                            showOwner: data.showOwner ?? old.settings?.showOwner,
                            showLastModified: data.showLastModified ?? old.settings?.showLastModified
                        }
                    }
                }
            )

            // Return a context object with the snapshotted value
            return { previousDraft }
        },
        onError: (_, variables, context: any) => {
            const key = draftKeys.detail(variables.workspaceId, variables.docId, variables.draftId)
            if (context?.previousDraft) {
                queryClient.setQueryData(key, context.previousDraft)
            }
        },
        ...restConfig
    })
}
