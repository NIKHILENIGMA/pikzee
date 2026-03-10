import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import { DOCUMENT_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { documentKeys, workspaceKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'
import type { DocumentCreatedDTO } from '../types'

export const createDocumentSchema = z.object({
    workspaceId: z.string().min(1, 'Workspace ID is required'),
    title: z.string().min(1, 'Title is required'),
    visibility: z.enum(['private', 'workspace', 'public']).default('workspace')
})

export type CreateDocument = z.infer<typeof createDocumentSchema>

export const createDocument = async (data: CreateDocument) => {
    const newDocument =  await client.post<DocumentCreatedDTO, CreateDocument>(`${DOCUMENT_API_BASE}?workspaceId=${data.workspaceId}`, data)

    return newDocument.data
}

type UseCreateDocument = {
    mutationConfig?: MutationConfig<typeof createDocument> 
}

export const useCreateDocument = ({ workspaceId, mutationConfig }: UseCreateDocument & { workspaceId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => createDocument(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: documentKeys.lists(workspaceId)
            })
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.default()
            })
        }
    })
}
