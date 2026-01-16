// import { v2 as cloudinary } from 'cloudinary'
// import { StorageProvider, UploadOptions, UploadResult } from '../uploader.types'

// export interface CloudinaryConfig {
//     cloudName: string
//     apiKey: string
//     apiSecret: string
// }

// export class CloudinaryProvider implements StorageProvider {
//     constructor(config: CloudinaryConfig) {
//         cloudinary.config({
//             cloud_name: config.cloudName,
//             api_key: config.apiKey,
//             api_secret: config.apiSecret
//         })
//     }

//     async upload(file: Buffer | string, options: UploadOptions = {}): Promise<UploadResult> {
//         return new Promise((resolve, reject) => {
//             const uploadOptions: any = {
//                 folder: options.folder,
//                 public_id: options.fileName,
//                 resource_type: 'auto'
//             }

//             if (options.metadata) {
//                 uploadOptions.context = options.metadata
//             }

//             const uploadStream = cloudinary.uploader.upload_stream(
//                 uploadOptions,
//                 (error, result) => {
//                     if (error) {
//                         reject(error)
//                     } else if (result) {
//                         resolve({
//                             url: result.secure_url,
//                             publicId: result.public_id,
//                             provider: 'Cloudinary',
//                             metadata: result.context
//                         })
//                     }
//                 }
//             )

//             if (Buffer.isBuffer(file)) {
//                 uploadStream.end(file)
//             } else {
//                 const buffer = Buffer.from(file, 'base64')
//                 uploadStream.end(buffer)
//             }
//         })
//     }

//     async delete(publicId: string): Promise<boolean> {
//         try {
//             const result = await cloudinary.uploader.destroy(publicId)
//             return result.result === 'ok'
//         } catch (error) {
//             console.error('Cloudinary delete error:', error)
//             return false
//         }
//     }

//     async getUrl(publicId: string): Promise<string> {
//         return cloudinary.url(publicId, { secure: true })
//     }

//     async generateUploadUrl(options?: UploadOptions): Promise<{ uploadUrl: string; key: string }> {
//         // Cloudinary does not support pre-signed upload URLs in the same way as S3.
//         // Instead, we can return the upload endpoint and necessary parameters.
//         const key = options?.fileName || `upload_${Date.now()}`
//         const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/auto/upload`

//         return {
//             uploadUrl,
//             key
//         }
//     }

//     async finalizeUpload(key: string): Promise<UploadResult> {
//         // In Cloudinary, uploads are finalized upon upload completion.
//         // This method can be used to fetch the uploaded resource details if needed.
//         const result = await cloudinary.api.resource(key)
//         return {
//             url: result.secure_url,
//             publicId: result.public_id,
//             provider: 'Cloudinary',
//             metadata: result.context
//         }
//     }
// }
