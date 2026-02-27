import { useMutation, useQueryClient } from '@tanstack/react-query'

import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { documentKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

export type UpdateDocumentParams = {
    workspaceId: string
    documentId: string
    title: string
}

export const updateDocument = async ({ workspaceId, documentId, title }: UpdateDocumentParams) => {
    return await client.patch<void, { workspaceId: string; title: string }>(`${WORKSPACE_API_BASE}/${workspaceId}/documents/${documentId}`, {
        workspaceId,
        title
    })
}

type UseUpdateDocument = {
    mutationConfig?: MutationConfig<typeof updateDocument>
}

export const useUpdateDocument = ({ mutationConfig }: UseUpdateDocument = {}) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (params) => updateDocument(params),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: documentKeys.lists(variables.workspaceId)
            })
        }
    })
}
