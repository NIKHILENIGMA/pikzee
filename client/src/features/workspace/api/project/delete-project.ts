import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PROJECTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { workspaceKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

export const deleteProject = async (projectId: string) => {
    return await client.delete<null>(`${PROJECTS_API_BASE}/${projectId}`)
}

export type DeleteProject = (projectId: string) => Promise<null>

type UseDeleteProject = {
    mutationConfig?: MutationConfig<typeof deleteProject>
}

export const useDeleteProject = ({ mutationConfig }: UseDeleteProject = {}) => {
    const queryClient = useQueryClient()

    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        ...restConfig,
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.default()
            })
        }
    })
}
