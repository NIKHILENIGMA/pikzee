import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

export const deleteEmoji = async (data: { documentId: string; workspaceId: string; pageId: string }): Promise<null> => {
    await client.delete<null>(`${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.pageId}/emoji?workspaceId=${data.workspaceId}`)

    return null
}

type UseDeleteEmoji = {
    mutationConfig?: MutationConfig<typeof deleteEmoji>
}

export const useDeleteEmoji = ({ workspaceId, draftId, mutationConfig }: UseDeleteEmoji & { workspaceId: string; draftId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => deleteEmoji(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.detail(workspaceId, draftId)
            })
        }
    })
}
