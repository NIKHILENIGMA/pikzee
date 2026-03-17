import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

import client from '@/shared/lib/api-client'
import { DOCUMENT_API_BASE, DRAFT_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'
import { draftKeys } from '@/shared/lib/query-keys'

export const EmojiSchema = z.object({
    icon: z.string(),
    
})

type AddEmojiDTO = z.infer<typeof EmojiSchema>

export const addEmoji = async (data: { documentId: string; draftId: string; workspaceId: string } & AddEmojiDTO) => {
    await client.post<null, AddEmojiDTO>(
        `${DOCUMENT_API_BASE}/${data.documentId}${DRAFT_API_BASE}/${data.draftId}/emoji?workspaceId=${data.workspaceId}`,
        {
            icon: data.icon
        }
    )
}

type UseAddEmoji = {
    mutationConfig?: MutationConfig<typeof addEmoji>
}

export const useAddEmoji = ({ workspaceId, draftId, mutationConfig }: UseAddEmoji & { workspaceId: string; draftId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}

    return useMutation({
        ...restConfig,
        mutationFn: (data) => addEmoji(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: draftKeys.detail(workspaceId, draftId)
            }),
            queryClient.invalidateQueries({
                queryKey: draftKeys.lists(workspaceId)
            })
        }
    })
}
