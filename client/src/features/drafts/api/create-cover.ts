import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

export const addCoverImage = async (data: { documentId: string; draftId: string; workspaceId: string }) => {
    const response = await client.post<{ coverImageUrl: string }, null>(
        `${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.draftId}/cover-image?workspaceId=${data.workspaceId}`,
        null
    )
    return response.data.coverImageUrl
}

type UseCreateCoverImage = {
    mutationConfig?: MutationConfig<typeof addCoverImage>
}

export const useCreateCoverImage = ({ workspaceId, draftId, mutationConfig }: UseCreateCoverImage & { workspaceId: string; draftId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => addCoverImage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.detail(workspaceId, draftId)
            })
        }
    })
}
