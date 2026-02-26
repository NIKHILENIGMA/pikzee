// import ImageKit from 'imagekit'

// import {
//   IImageKitUploader,
//   ImageKitParams,
//   ImageKitResult
// } from '../uploader.types'

// export class ImageKitUploader implements IImageKitUploader {
//   public provider = 'imagekit' as const
//   private client: ImageKit

//   constructor() {
//     this.validateEnv()

//     this.client = new ImageKit({
//       publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
//       privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
//       urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
//     })
//   }

//   // Builds a transformed ImageKit URL without any upload
//   // ImageKit transforms on the fly via URL parameters
//   getImagekitTransformer(params: ImageKitParams): ImageKitResult {
//     const { src, transformations } = params

//     const url = this.client.url({
//       src,
//       transformation: transformations.map(t => ({
//         width: t.width?.toString(),
//         height: t.height?.toString(),
//         quality: t.quality?.toString(),
//         format: t.format,
//         crop: t.crop
//       }))
//     })

//     return { url, transformations }
//   }

//   private validateEnv(): void {
//     const required = [
//       'IMAGEKIT_PUBLIC_KEY',
//       'IMAGEKIT_PRIVATE_KEY',
//       'IMAGEKIT_URL_ENDPOINT'
//     ]

//     const missing = required.filter(key => !process.env[key])

//     if (missing.length > 0) {
//       throw new Error(`ImageKitUploader missing env vars: ${missing.join(', ')}`)
//     }
//   }
// }
