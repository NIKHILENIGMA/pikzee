import client from '@/shared/lib/api-client'

const INTEGRATE_API_BASE = '/integrations/social/youtube'

interface YoutubeStatus {
    connected: boolean
    channelTitle: string
    channelId: string
}

interface CompleteUploadReqBody {
    uploadId: string
    videoId: string
    error?: string
}

export const integrationStatus = async () => {
    const response = await client.get<YoutubeStatus>(`${INTEGRATE_API_BASE}/status`)
    return response.data
}

export const initiateOAuthFlow = async () => {
    const response = await client.get<{ url: string }>(`${INTEGRATE_API_BASE}/connect`)
    return response.data
}

export const handleOAuthCallback = async (code: string, state: string) => {
    const response = await client.post<{ success: boolean }, null>(`${INTEGRATE_API_BASE}/callback?code=${code}&state=${state}`, null)
    return response.data.success
}

interface ResumableUploadData {
    title: string
    description: string
    privacy: string
    fileSize: number
}

export const generateResumableUploadUrl = async (videoMetadata: ResumableUploadData) => {
    try {
        const response = await client.post<
            {
                uploadUrl: string
                uploadId: string
                accessToken: string
            },
            ResumableUploadData
        >(`${INTEGRATE_API_BASE}/generate-upload-url`, videoMetadata)
        return response.data
    } catch (error) {
        throw new Error(`Failed to generate upload URL.: ${(error as Error).message}`)
    }
}

export const completeUpload = async (data: CompleteUploadReqBody) => {
    const response = await client.post<{ success: boolean }, CompleteUploadReqBody>(`${INTEGRATE_API_BASE}/complete-upload`, data)
    return response.data.success
}

export const disconnectIntegration = async () => {
    const response = await client.post<{ disconnect: boolean }, null>(`${INTEGRATE_API_BASE}/disconnect`, null)
    return response.data.disconnect
}
