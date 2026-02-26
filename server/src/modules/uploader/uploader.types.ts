// Every provider must follow this base contract
export interface IUploader {
    provider: UploaderProvider
}

// S3 specific contract
export interface IS3Uploader extends IUploader {
    getPresignedUrl(params: PresignedUrlParams): Promise<PresignedUrlResult>
    generateMultipartUpload(params: MultipartParams): Promise<MultipartResult>
    s3Stream(key: string): Promise<NodeJS.ReadableStream>
}

// ImageKit specific contract
export interface IImageKitUploader extends IUploader {
    getImagekitTransformer(params: ImageKitParams): ImageKitResult
}

// Provider names — add more here as you grow
export type UploaderProvider = 'S3' | 'imagekit'

// S3 Types
export interface PresignedUrlParams {
    bucket: 'public' | 'private' // forces you to be explicit
    key: string // file path inside bucket
    contentType: string // e.g. image/jpeg, application/pdf
    expiresIn?: number // seconds, default 900 (15 mins)
}

export interface PresignedUrlResult {
    uploadUrl: string // PUT to this URL
    fileUrl: string // final public/access URL after upload
    expiresIn: number
}

export interface MultipartParams {
    bucket: 'public' | 'private'
    key: string
    contentType: string
}

export interface MultipartResult {
    uploadId: string
    key: string
    bucket: string
}

// ImageKit Types
export interface ImageKitParams {
    src: string // original image URL
    transformations: ImageKitTransformation[]
}

export interface ImageKitTransformation {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'maintain_ratio' | 'force' | 'at_least'
}

export interface ImageKitResult {
    url: string
    transformations: ImageKitTransformation[]
}
