export interface UploadOptions {
    folder?: string
    fileName?: string
    public?: boolean
    metadata?: Record<string, string>
    expiredIn?: number
}

export interface InitiateMultipartUploadOptions {
    public: boolean
    metadata?: Record<string, string>
}

export interface UploadResult {
    url: string
    publicId?: string
    key?: string
    provider: string
    metadata?: Record<string, any>
}

export interface GenerateUploadUrlResult {
    uploadUrl: string
    key: string
}

// Request for /v1/uploader/plan-uploads
export interface FileToUpload {
    name: string
    size: number
    type: string
}

export interface PlanUploadsRequest {
    workspaceId: string
    projectId?: string
    files: FileToUpload[]
}

// Response for /v1/uploader/plan-uploads
export type UploadJobType = 'direct' | 'multipart'

export interface DirectUploadJob {
    type: 'direct'
    fileName: string
    fileSize: number
    uploadUrl: string
    key: string // S3 object key
}

export interface MultipartUploadPart {
    partNumber: number
    uploadUrl: string // Pre-signed URL for this part
}

export interface MultipartUploadJob {
    type: 'multipart'
    fileName: string
    fileSize: number
    uploadId: string // S3 Upload ID
    key: string // S3 object key
    parts: MultipartUploadPart[]
}

export interface CompleteMultipartUploadOptions {
    key: string
    uploadId: string
    parts: {
        ETag: string
        PartNumber: number
    }[]
}

export interface CompleteMultipartUploadResponse {
    success: boolean
    key: string
}

export type UploadJob = DirectUploadJob | MultipartUploadJob

export interface PlanUploadsResponse {
    jobs: UploadJob[]
}

export interface StorageProvider {
    upload(file: Buffer | string, options?: UploadOptions): Promise<UploadResult>
    delete(identifier: string): Promise<boolean>
    getUrl(identifier: string): Promise<string>
}

