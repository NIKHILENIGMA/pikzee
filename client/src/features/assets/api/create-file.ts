import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/shared/lib/api-client'
import { PROJECTS_API_BASE } from '@/shared/constants'
import type { MutationConfig } from '@/shared/lib/react-query'

export interface CreateFileData {
    projectId: string
    folderId: string | undefined
    filename: string
    mimeType:
        | 'image/jpeg'
        | 'image/png'
        | 'image/webp'
        | 'video/mp4'
        | 'video/quicktime'
        | 'video/webm'
        | 'application/pdf'
        | 'text/plain'
        | 'audio/mpeg'
        | 'audio/webm'
    sizeBytes: number
}

export interface CreateFileResponse {
    url: string
    assetId: string
}

// Step 1: Initiate upload (get presigned URL and assetId)
export const initiateUpload = async (data: CreateFileData) => {
    const response = await client.post<CreateFileResponse, CreateFileData>(`${PROJECTS_API_BASE}/${data.projectId}/assets/presigned-url`, data)
    return response.data
}

// Step 2: Confirm upload
export const confirmUpload = async (data: { projectId: string; assetId: string }) => {
    await client.post<null, { assetId: string }>(`${PROJECTS_API_BASE}/${data.projectId}/assets/confirm`, { assetId: data.assetId })
}

type UseInitiateUpload = {
    mutationConfig?: MutationConfig<typeof initiateUpload>
}

export const useInitiateUpload = ({ mutationConfig }: UseInitiateUpload) => {
    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        mutationFn: initiateUpload,
        ...restConfig
    })
}

type UseConfirmUpload = {
    mutationConfig?: MutationConfig<typeof confirmUpload>
}

export const useConfirmUpload = ({ mutationConfig }: UseConfirmUpload) => {
    const queryClient = useQueryClient()
    const { ...restConfig } = mutationConfig || {}
    return useMutation({
        mutationFn: (data) => confirmUpload(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['folder-contents', variables.projectId, variables.assetId] })
        },
        ...restConfig
    })
}
