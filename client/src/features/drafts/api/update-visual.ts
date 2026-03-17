import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

export const updateDraftVisualSchema = z.object({
    icon: z.string().or(z.literal(null)).optional(),
    coverImageUrl: z.url({ message: 'Invalid cover image URL' }).or(z.literal(null)).optional(),
    coverImageConfig: z
        .object({
            type: z.enum(['S3', 'URL', 'unsplash']),
            positionY: z.number().min(0).max(100),
            focalPoint: z.object({
                x: z.number().min(0).max(100),
                y: z.number().min(0).max(100)
            })
        })
        .optional()
})

export type UpdateDraftVisual = z.infer<typeof updateDraftVisualSchema>

export const updateDraftVisual = async (data: { workspaceId: string; docId: string; draftId: string } & UpdateDraftVisual) => {
    await client.patch<null, UpdateDraftVisual>(
        `${DOCUMENT_API_BASE}/${data.docId}${DRAFT_API_BASE}/${data.draftId}/visual?workspaceId=${data.workspaceId}`,
        {
            icon: data.icon,
            coverImageUrl: data.coverImageUrl,
            coverImageConfig: data.coverImageConfig
        }
    )
}

type UseUpdateDraftVisual = {
    mutationConfig?: MutationConfig<typeof updateDraftVisual>
}

export const useUpdateDraftVisual = ({ workspaceId, draftId, mutationConfig }: UseUpdateDraftVisual & { workspaceId: string; draftId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateDraftVisual(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.detail(workspaceId, draftId)
            }),
            queryClient.invalidateQueries({
                queryKey: draftKeys.lists(workspaceId)
            })
        }
    })
}
