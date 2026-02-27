import { useMutation, useQueryClient } from '@tanstack/react-query'

import { WORKSPACE_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { documentKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

export type DeleteDocumentParams = {
    workspaceId: string
    documentId: string
}

export const deleteDocument = async ({ workspaceId, documentId }: DeleteDocumentParams) => {
    return await client.delete<null>(`${WORKSPACE_API_BASE}/${workspaceId}/documents/${documentId}`)
}

type UseDeleteDocument = {
    mutationConfig?: MutationConfig<typeof deleteDocument>
}

export const useDeleteDocument = ({ mutationConfig }: UseDeleteDocument = {}) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (params) => deleteDocument(params),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: documentKeys.lists(variables.workspaceId)
            })
        }
    })
}
