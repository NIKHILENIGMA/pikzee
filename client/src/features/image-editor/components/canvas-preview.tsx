import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { useStore } from '@/shared/store'
import { buildImageKitURL } from '../util/imagekit-url-builder'
import client from '@/shared/lib/api-client'

const IMAGEKIT_BASE_URL: string = String(import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/default/')

export function CanvasPreview() {
    const originalPath = useStore((state) => state.originalPath)
    const transformations = useStore((state) => state.transformations)
    const setOriginalPath = useStore((state) => state.setOriginalPath)

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setOriginalPath(reader.result)
                }
            }
            reader.readAsDataURL(file)

            const response = await client.post<{ uploadUrl: string }, { contentType: string; key: string; fileName: string }>(
                '/uploads/generate-url',
                {
                    contentType: file.type,
                    key: `editor-images`,
                    fileName: file.name
                }
            )

            const url = response.data.uploadUrl

            await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type
                },
                body: file
            })
            
        },
        [setOriginalPath]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'image/*': []
        }
    })

    if (!originalPath) {
        return (
            <div
                {...getRootProps()}
                className={`flex flex-1 cursor-pointer items-center justify-center dark:bg-[#0e0e0f] p-16 transition-colors ${
                    isDragActive ? 'bg-primary/10' : ''
                }`}>
                <input {...getInputProps()} />
                <div className="w-full h-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
                    <p className="text-base font-semibold text-foreground">No image selected</p>
                    <p className="mt-2 text-sm text-muted-foreground">Drag and drop an image here, or click to upload and start editing.</p>
                </div>
            </div>
        )
    }

    const url = originalPath
        ? originalPath
        : buildImageKitURL(`${IMAGEKIT_BASE_URL.replace(/\/+$/, '')}/${originalPath.replace(/^\/+/, '')}`, transformations)

    return (
        <div
            {...getRootProps()}
            className={`flex flex-1 cursor-pointer items-center justify-center dark:bg-[#0e0e0f] p-20 transition-colors ${
                isDragActive ? 'bg-primary/10' : ''
            }`}>
            <input {...getInputProps()} />
            <div>
                <img
                    src={url}
                    alt="Preview"
                    className="mx-auto max-h-[calc(100vh-180px)] w-auto max-w-full object-contain"
                />
            </div>
        </div>
    )
}
