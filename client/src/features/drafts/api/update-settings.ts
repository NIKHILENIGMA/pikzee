import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

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

export const useUpdateDraftSettings = ({ workspaceId, draftId, mutationConfig }: UseUpdateDraftSettings & { workspaceId: string; draftId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateDraftSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.detail(workspaceId, draftId)
            })
        }
    })
}
