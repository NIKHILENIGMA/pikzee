import { S3Uploader } from './providers/s3.provider'
import { IS3Uploader, IImageKitUploader, UploaderProvider } from './uploader.types'

const providers = {
    S3: new S3Uploader()
    //   imagekit: new ImageKitUploader()
} as const

type ProviderMap = typeof providers
export type ProviderName = keyof ProviderMap

function Uploader<T extends ProviderName>(provider: T): ProviderMap[T] {
    const resolved = providers[provider]

    if (!resolved) {
        throw new Error(`Unknown upload provider: ${provider}`)
    }

    return resolved
}

export default Uploader
export type { IS3Uploader, IImageKitUploader, UploaderProvider }
