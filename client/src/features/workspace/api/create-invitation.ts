import { useMutation } from '@tanstack/react-query'
import z from 'zod'

import { INVITATIONS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import type { MutationConfig } from '@/shared/lib/react-query'

// Zod schema for invitation creation
export const createInvitationSchema = z.object({
    email: z.email(),
    workspaceId: z.uuid(),
    permission: z.enum(['FULL_ACCESS', 'EDIT', 'COMMENT_ONLY', 'VIEW_ONLY']),
    customMessage: z.string().optional()
})

// Type inferred from the Zod schema
export type CreateInvitation = z.infer<typeof createInvitationSchema>

// API function to create a workspace invitation
export const createInvitation = async (data: CreateInvitation) => {
    return await client.post<void, CreateInvitation>(`${INVITATIONS_API_BASE}/send-invite`, data)
}

// Type for the hook's parameters
type UseCreateInvitation = {
    mutationConfig?: MutationConfig<typeof createInvitation>
}

/**
 * Hook for creating workspace invitations.
 *
 * @param mutationConfig - Optional mutation configuration including success callback.
 * @returns React Query mutation object for invitation creation.
 */
export const useCreateInvitation = ({ mutationConfig }: UseCreateInvitation = {}) => {
    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        ...restConfig,
        mutationFn: (data) => createInvitation(data)
    })
}
