import { SOCIAL_ACCOUNTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { socialAccountKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// API function to create a connection for a social media account. It returns the URL to redirect the user for OAuth authentication.
export const connectAccount = async (platform: string): Promise<string> => {
    const response = await client.post<{ url: string }, null>(`${SOCIAL_ACCOUNTS_API_BASE}/connect/${platform.toUpperCase()}`, null)
    return response.data.url
}

// Type for the hook's parameters
type UseConnectAccount = {
    mutationConfig?: MutationConfig<typeof connectAccount>
}

/**
 * Hook for connecting a social media account to the platform. It triggers the OAuth flow and invalidates the accounts query on success to refresh the list of connected accounts.
 *
 * @param workspaceId - The ID of the workspace for which to connect the account.
 * @param mutationConfig - Optional configuration for the mutation, such as onSuccess, onError callbacks, etc.
 * @returns A mutation object that can be used to trigger the account connection process.
 */
export const useConnectAccount = ({ workspaceId, mutationConfig }: UseConnectAccount & { workspaceId: string }) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        ...restConfig,
        mutationFn: (platform: string) => connectAccount(platform),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: socialAccountKeys.all(workspaceId)
            })
        }
    })
}
