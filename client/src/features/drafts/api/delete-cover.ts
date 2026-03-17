import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

export const removeCoverImage = async (data: { documentId: string; draftId: string; workspaceId: string }) => {
    await client.delete<null>(
        `${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.draftId}/cover-image?workspaceId=${data.workspaceId}`
    )
}

type UseRemoveCoverImage = {
    mutationConfig?: MutationConfig<typeof removeCoverImage>
}

export const useRemoveCoverImage = ({ workspaceId, draftId, mutationConfig }: UseRemoveCoverImage & { workspaceId: string; draftId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => removeCoverImage(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.detail(workspaceId, draftId)
            })
        }
    })
}
