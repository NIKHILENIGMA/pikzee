import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

export const updateDraftVisualSchema = z.object({
    icon: z.string().optional(),
    type: z.enum(['S3', 'URL', 'unsplash']).optional(),
    coverImageUrl: z.url({ message: 'Invalid cover image URL' }).optional(),
    coverImageConfig: z
        .object({
            x: z.number().optional(),
            y: z.number().optional()
        })
        .optional()
})

export type UpdateDraftVisual = z.infer<typeof updateDraftVisualSchema>

export const updateDraftVisual = async (data: { workspaceId: string; docId: string; draftId: string } & UpdateDraftVisual) => {
    await client.post<null, UpdateDraftVisual>(
        `${DOCUMENT_API_BASE}/${data.docId}/${DRAFT_API_BASE}/${data.draftId}?workspaceId=${data.workspaceId}`,
        {
            icon: data.icon,
            type: data.type,
            coverImageUrl: data.coverImageUrl,
            coverImageConfig: data.coverImageConfig
        }
    )
}

type UseUpdateDraftVisual = {
    mutationConfig?: MutationConfig<typeof updateDraftVisual>
}

export const useUpdateDraftVisual = ({ workspaceId, mutationConfig }: UseUpdateDraftVisual & { workspaceId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateDraftVisual(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.lists(workspaceId)
            })
        }
    })
}
