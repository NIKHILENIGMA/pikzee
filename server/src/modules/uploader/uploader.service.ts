import { StorageProvider, UploadOptions, UploadResult } from './uploader.types'

export class Uploader<T extends StorageProvider = StorageProvider> {
    private provider: T
    private static instance: Uploader

    constructor(provider: T) {
        this.provider = provider
    }

    static getInstance(provider: StorageProvider): Uploader {
        if (!Uploader.instance) {
            Uploader.instance = new Uploader(provider)
        }
        return Uploader.instance
    }

    async upload(file: Buffer | string, options?: UploadOptions): Promise<UploadResult> {
        return this.provider.upload(file, options)
    }

    async delete(identifier: string): Promise<boolean> {
        return this.provider.delete(identifier)
    }

    async getUrl(identifier: string): Promise<string> {
        return await this.provider.getUrl(identifier)
    }

    /**
     * Get the underlying provider to access provider-specific methods
     */
    getProvider(): T {
        return this.provider
    }
}
