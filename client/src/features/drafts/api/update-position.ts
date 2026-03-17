import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'
import z from 'zod'

const updateCoverImagePositionSchema = z.object({
    positionY: z.number()
})

export type UpdateCoverImagePositionDTO = z.infer<typeof updateCoverImagePositionSchema>

export const updateCoverImagePosition = async (data: { documentId: string; draftId: string; workspaceId: string } & UpdateCoverImagePositionDTO) => {
    await client.patch<null, UpdateCoverImagePositionDTO>(
        `${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.draftId}/cover-image?workspaceId=${data.workspaceId}`,
        {
            positionY: data.positionY
        }
    )
}

type UseUpdateCoverImagePosition = {
    mutationConfig?: MutationConfig<typeof updateCoverImagePosition>
}

export const useUpdateCoverImagePosition = ({
    workspaceId,
    draftId,
    mutationConfig
}: UseUpdateCoverImagePosition & { workspaceId: string; draftId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateCoverImagePosition(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.detail(workspaceId, draftId)
            })
        }
    })
}
