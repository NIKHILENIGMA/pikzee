import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'
import z from 'zod'
import { toast } from 'sonner'

const updateCoverImageSchema = z.object({
    coverImageUrl: z.union([z.url({ message: 'Invalid cover image URL' }), z.null()]),
    type: z.union([z.enum(['S3', 'URL', 'unsplash']), z.null()])
})

export type UpdateCoverImageDTO = z.infer<typeof updateCoverImageSchema>

export const updateCoverImage = async (data: { documentId: string; draftId: string; workspaceId: string } & UpdateCoverImageDTO) => {
    await client.patch<null, UpdateCoverImageDTO>(
        `${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.draftId}/cover-image?workspaceId=${data.workspaceId}`,
        {
            coverImageUrl: data.coverImageUrl || null,
            type: data.type || null
        }
    )
}

type UseUpdateCoverImage = {
    mutationConfig?: MutationConfig<typeof updateCoverImage>
}

export const useUpdateCoverImage = ({ mutationConfig }: UseUpdateCoverImage) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateCoverImage(data),
        onMutate: async (data) => {
            const key = draftKeys.detail(data.workspaceId, data.documentId, data.draftId)

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: key })

            // Snapshot the previous value
            const previousDraft = queryClient.getQueryData(key)

            // Optimistically update to the new value
            queryClient.setQueryData(
                key,
                (old: {
                    coverImageUrl: string | null
                    coverImageConfig: { type: string | null; positionY: number; focalPoint: { x: number; y: number } }
                }) => {
                    if (!old) return old

                    return {
                        ...old,
                        coverImageUrl: data.coverImageUrl || null,
                        coverImageConfig: {
                            type: data.type || null,
                            positionY: old.coverImageConfig?.positionY || 50,
                            focalPoint: old.coverImageConfig?.focalPoint || { x: 50, y: 50 }
                        }
                    }
                }
            )

            // Return a context object with the snapshotted value
            return { previousDraft }
        },

        onError: (_, variables, context) => {
            const key = draftKeys.detail(variables.workspaceId, variables.documentId, variables.draftId)
            // Rollback to the previous value if the mutation fails
            if (context?.previousDraft) {
                queryClient.setQueryData(key, context.previousDraft)
            }

            toast.error('Failed to update cover image. Please try again.')
        },

        onSettled: (_, __, variables) => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.detail(variables.workspaceId, variables.documentId, variables.draftId)
            })
        }
    })
}
