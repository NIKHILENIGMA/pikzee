import { useMutation, useQueryClient } from '@tanstack/react-query'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

export const deleteDraft = async (data: { documentId: string; workspaceId: string, pageId: string }): Promise<null> => {
    await client.delete<null>(`${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.pageId}?workspaceId=${data.workspaceId}`)

    return null
}

type UseDeleteDraft = {
    mutationConfig?: MutationConfig<typeof deleteDraft>
}

export const useDeleteDraft = ({ workspaceId, mutationConfig }: UseDeleteDraft & { workspaceId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => deleteDraft(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.lists(workspaceId)
            })
        }
    })
}
