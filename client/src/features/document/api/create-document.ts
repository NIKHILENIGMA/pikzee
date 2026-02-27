import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import { DOCUMENT_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { documentKeys, workspaceKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

export const createDocumentSchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    title: z.string().min(1, 'Title is required'),
    createdBy: z.string().min(1, 'Creator ID is required')
})

export type CreateDocument = z.infer<typeof createDocumentSchema>

export const createDocument = async (data: CreateDocument) => {
    return await client.post<void, CreateDocument>(`${DOCUMENT_API_BASE}/${data.workspaceId}/documents`, data)
}

type UseCreateDocument = {
    mutationConfig?: MutationConfig<typeof createDocument>
}

export const useCreateDocument = ({ mutationConfig }: UseCreateDocument = {}) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => createDocument(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: documentKeys.lists(variables.workspaceId)
            })
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.default()
            })
        }
    })
}
