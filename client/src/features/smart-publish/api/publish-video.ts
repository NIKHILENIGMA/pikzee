import { useMutation } from '@tanstack/react-query'
import { SOCIAL_ACCOUNTS_API_BASE } from '@/shared/constants'
import client from '@/shared/lib/api-client'
import { type MutationConfig } from '@/shared/lib/react-query'

export type VideoUploadData = {
    workspaceId: string
    socialAccountId: string
    title: string
    description?: string
    visibility?: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
    contentType: string
}

export type UploadVideoParams = {
    platform: string
    data: VideoUploadData
}

export type UploadVideoResponse = {
    url: string
    postId: string
}

export const initiateVideoUpload = async ({ platform, data }: UploadVideoParams): Promise<UploadVideoResponse> => {
    const response = await client.post<UploadVideoResponse, VideoUploadData>(`${SOCIAL_ACCOUNTS_API_BASE}/upload-video/${platform}`, data)
    return response.data
}

export type PublishVideoParams = {
    postId: string
    platform: string
}

export const publishVideo = async ({ postId, platform }: PublishVideoParams): Promise<{ success: boolean }> => {
    const response = await client.post<{ success: boolean }, PublishVideoParams>(`${SOCIAL_ACCOUNTS_API_BASE}/publish`, {
        postId,
        platform
    })
    return response.data
}

type UseInitiateVideoUploadOptions = {
    mutationConfig?: MutationConfig<typeof initiateVideoUpload>
}

export const useInitiateVideoUpload = ({ mutationConfig }: UseInitiateVideoUploadOptions = {}) => {
    return useMutation({
        mutationFn: initiateVideoUpload,
        ...mutationConfig
    })
}

type UsePublishVideoOptions = {
    mutationConfig?: MutationConfig<typeof publishVideo>
}

export const usePublishVideo = ({ mutationConfig }: UsePublishVideoOptions = {}) => {
    return useMutation({
        mutationFn: publishVideo,
        ...mutationConfig
    })
}
