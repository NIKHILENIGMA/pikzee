import { useMutation } from '@tanstack/react-query'
import z from 'zod'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'

export const updateDraftContentSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    content: z.any().optional()
})

export type UpdateDraftContent = z.infer<typeof updateDraftContentSchema>

export const updateDraftContent = async (data: { workspaceId: string; docId: string; draftId: string } & UpdateDraftContent) => {
    const payload: UpdateDraftContent = {}

    if (data.title !== undefined) payload.title = data.title
    if (data.content !== undefined) payload.content = data.content

    await client.patch<null, UpdateDraftContent>(
        `${DOCUMENT_API_BASE}/${data.docId}${DRAFT_API_BASE}/${data.draftId}/content?workspaceId=${data.workspaceId}`,
        payload
    )
}

type UseUpdateDraftContent = {
    mutationConfig?: MutationConfig<typeof updateDraftContent>
}

export const useUpdateDraftContent = ({ mutationConfig }: UseUpdateDraftContent) => {
    // const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => updateDraftContent(data),
    })
}
