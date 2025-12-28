import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PROJECTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { workspaceKeys } from '@/shared/lib/query-keys'
import type { MutationConfig } from '@/shared/lib/react-query'

import type { ProjectDTO } from '../../types'

type UpdateProjectDetailsParams = {
    projectName?: string | undefined
    projectCoverImageUrl?: string | undefined
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | undefined
    isAccessRestricted?: boolean | undefined
}

export const updateProjectDetails = async (project: { projectId: string; data: UpdateProjectDetailsParams }) => {
    return await client.patch<void, UpdateProjectDetailsParams>(`${PROJECTS_API_BASE}/${project.projectId}`, project.data)
}

export type UpdateProjectDetails = (projectId: string, data: Partial<ProjectDTO>) => Promise<void>

type UseUpdateProjectDetails = {
    mutationConfig?: MutationConfig<typeof updateProjectDetails>
}

export const useUpdateProjectDetails = ({ mutationConfig }: UseUpdateProjectDetails = {}) => {
    const { ...restConfig } = mutationConfig || {}
    const queryClient = useQueryClient()
    return useMutation({
        ...restConfig,
        mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectDetailsParams }) => updateProjectDetails({ projectId, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: workspaceKeys.default()
            })
        }
    })
}
