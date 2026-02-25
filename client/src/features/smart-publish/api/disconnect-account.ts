import { SOCIAL_ACCOUNTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { socialAccountKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// API function to disconnect a social media account
export const disconnectAccount = async (params: { accountId: string; platform: string }): Promise<void> => {
    await client.post<null, { platform: string }>(`${SOCIAL_ACCOUNTS_API_BASE}/disconnect/${params.accountId}`, {
        platform: params.platform.toUpperCase()
    })
}

// Type for the hook's parameters
type UseDisconnectAccount = {
    mutationConfig?: MutationConfig<typeof disconnectAccount>
}

/**
 * Hook for disconnecting a social media account from the platform. It triggers the disconnection process and invalidates the accounts query on success to refresh the list of connected accounts.
 * 
 * @param workspaceId - The ID of the workspace for which to disconnect the account.
 * @param mutationConfig - Optional configuration for the mutation, such as onSuccess, onError callbacks, etc.
 * @returns A mutation object that can be used to trigger the account disconnection process.
 */
export const useDisconnectAccount = ({ workspaceId, mutationConfig }: UseDisconnectAccount & { workspaceId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        ...restConfig,
        mutationFn: (params: { accountId: string; platform: string }) =>
            disconnectAccount({ accountId: params.accountId, platform: params.platform }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: socialAccountKeys.all(workspaceId)
            })
        }
    })
}
