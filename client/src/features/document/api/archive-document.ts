import { useMutation, useQueryClient } from '@tanstack/react-query'

import { DOCUMENT_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { documentKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

export type ArchiveDocumentParams = {
    workspaceId: string
    documentId: string
}

export const archiveDocument = async ({ workspaceId, documentId }: ArchiveDocumentParams) => {
    return await client.patch<null, null>(`${DOCUMENT_API_BASE}/${documentId}/archive?workspaceId=${workspaceId}`, null)
}

type UseArchiveDocument = {
    mutationConfig?: MutationConfig<typeof archiveDocument>
}

export const useArchiveDocument = ({ workspaceId, mutationConfig }: UseArchiveDocument & { workspaceId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (params) => archiveDocument(params),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: documentKeys.lists(workspaceId)
            })
        }
    })
}
