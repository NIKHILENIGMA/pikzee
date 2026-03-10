import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

export const updateDraftContentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required')
})

export type UpdateDraftContent = z.infer<typeof updateDraftContentSchema>

export const updateDraftContent = async (data: { workspaceId: string; docId: string; draftId: string } & UpdateDraftContent) => {
    await client.post<null, UpdateDraftContent>(
        `${DOCUMENT_API_BASE}/${data.docId}/${DRAFT_API_BASE}/${data.draftId}?workspaceId=${data.workspaceId}`,
        {
            title: data.title,
            content: data.content
        }
    )
}

type UseUpdateDraftContent = {
    mutationConfig?: MutationConfig<typeof updateDraftContent>
}

export const useUpdateDraftContent = ({ workspaceId, mutationConfig }: UseUpdateDraftContent & { workspaceId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateDraftContent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.lists(workspaceId)
            })
        }
    })
}
