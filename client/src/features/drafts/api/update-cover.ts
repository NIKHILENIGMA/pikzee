import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'
import z from 'zod'

const updateCoverImageSchema = z.object({
    coverImageUrl: z.string(),
    type: z.enum(['S3', 'URL', 'unsplash'])
})

export type UpdateCoverImageDTO = z.infer<typeof updateCoverImageSchema>

export const updateCoverImage = async (data: { documentId: string; draftId: string; workspaceId: string } & UpdateCoverImageDTO) => {
    await client.patch<null, UpdateCoverImageDTO>(
        `${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.draftId}/cover-image?workspaceId=${data.workspaceId}`,
        {
            coverImageUrl: data.coverImageUrl,
            type: data.type
        }
    )
}

type UseUpdateCoverImage = {
    mutationConfig?: MutationConfig<typeof updateCoverImage>
}

export const useUpdateCoverImage = ({ workspaceId, draftId, mutationConfig }: UseUpdateCoverImage & { workspaceId: string; draftId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateCoverImage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.detail(workspaceId, draftId)
            })
        }
    })
}
