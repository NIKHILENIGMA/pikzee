import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'
import z from 'zod'
import { toast } from 'sonner'

const updateCoverImagePositionSchema = z.object({
    positionY: z.number()
})

export type UpdateCoverImagePositionDTO = z.infer<typeof updateCoverImagePositionSchema>

export const updateCoverImagePosition = async (data: { documentId: string; draftId: string; workspaceId: string } & UpdateCoverImagePositionDTO) => {
    await client.patch<null, UpdateCoverImagePositionDTO>(
        `${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.draftId}/cover-image/position?workspaceId=${data.workspaceId}`,
        {
            positionY: data.positionY
        }
    )
}

type UseUpdateCoverImagePosition = {
    mutationConfig?: MutationConfig<typeof updateCoverImagePosition>
}

export const useUpdateCoverImagePosition = ({ mutationConfig }: UseUpdateCoverImagePosition) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateCoverImagePosition(data),
        onMutate: async (data) => {
            const key = draftKeys.detail(data.workspaceId, data.documentId, data.draftId)

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: key })

            // Snapshot the previous value
            const previousDraft = queryClient.getQueryData(key)

            // Optimistically update to the new value
            queryClient.setQueryData(
                key,
                (old: { coverImageConfig: { type: string | null; positionY: number; focalPoint: { x: number; y: number } } }) => {
                    if (!old) return old

                    return {
                        ...old,
                        coverImageConfig: {
                            ...old.coverImageConfig,
                            positionY: data.positionY
                        }
                    }
                }
            )

            // Return context with the previous draft data for potential rollback in case of error
            return { previousDraft }
        },

        onError: (_, variables, context) => {
            const key = draftKeys.detail(variables.workspaceId, variables.documentId, variables.draftId)
            // Rollback to the previous draft data if the mutation fails
            if (context?.previousDraft) {
                queryClient.setQueryData(key, context.previousDraft)
            }

            toast.error('Failed to update cover image position. Please try again.')
        }
    })
}
