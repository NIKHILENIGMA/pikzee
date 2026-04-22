import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, Wand2 } from 'lucide-react'

import { useStore } from '@/shared/store'
import client from '@/shared/lib/api-client'
import { useTransformUrl } from '../hook/useTransformUrl'
import { cn } from '@/shared/lib/utils'

interface CanvasPreviewProps {
    transformedUrl?: string
    isPending?: boolean
}

export function CanvasPreview({ transformedUrl: propUrl, isPending: propIsPending }: CanvasPreviewProps) {
    const originalPath = useStore((state) => state.originalPath)
    const setOriginalPath = useStore((state) => state.setOriginalPath)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    

    const { transformedUrl: hookUrl, isPending: hookIsPending, state } = useTransformUrl(originalPath)

    const transformedUrl = propUrl ?? hookUrl
    const isDebouncing = propIsPending ?? hookIsPending
    const hasTransformations =
        (state.resize.width !== undefined || state.resize.height !== undefined || !!state.resize.aspectRatio) ||
        (state.crop.strategy !== 'maintain_ratio' && state.crop.strategy !== undefined) ||
        state.crop.zoom !== undefined ||
        state.textOverlay !== null ||
        state.ai.type !== 'none' ||
        !!state.ai.changeBackground?.prompt ||
        !!state.ai.editImage?.prompt
        
    const isProcessing = (isDebouncing || isLoading) && hasTransformations
    const isAIMagic = state.ai.type !== 'none' || !!state.ai.changeBackground?.prompt || !!state.ai.editImage?.prompt

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (!file) return

            setIsUploading(true)
            try {
                // Pre-view with base64 first
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

                // After successful upload, set originalPath to the S3 key
                const s3Key = `${file.name}`
                setOriginalPath(s3Key)
            } catch (error) {
                console.error('Upload failed:', error)
            } finally {
                setIsUploading(false)
            }
        },
        [setOriginalPath]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        noClick: !!originalPath, // Disable click to upload if image exists, use a separate button or drag-drop only
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
                    {isUploading ? (
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    ) : (
                        <>
                            <p className="text-base font-semibold text-foreground">No image selected</p>
                            <p className="mt-2 text-sm text-muted-foreground">Drag and drop an image here, or click to upload and start editing.</p>
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            className={`flex flex-1 items-center justify-center dark:bg-[#0e0e0f] p-10 transition-colors relative ${
                isDragActive ? 'bg-primary/10 border-2 border-dashed border-primary' : ''
            }`}>
            <input {...getInputProps()} />

            <div className="relative group w-full h-full flex items-center justify-center">
                {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-20 rounded transition-all duration-300">
                        <div className="bg-background/90 p-6 rounded-xl shadow-2xl border border-border flex flex-col items-center gap-4 min-w-[200px]">
                            {isAIMagic ? (
                                <>
                                    <div className="relative">
                                        <Wand2 className="h-10 w-10 text-primary animate-pulse" />
                                        <div className="absolute -top-1 -right-1">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-foreground">AI Magic is happening...</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Applying Neural Transforms</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="text-sm font-medium text-foreground">Updating Preview...</p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <img
                    key={transformedUrl}
                    src={transformedUrl}
                    alt="Transformed preview"
                    onLoadStart={() => {
                        setIsLoading(true)

                    }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false)
                    }}
                    className={cn(
                        'w-full h-full object-contain transition-opacity duration-300',
                        isProcessing ? 'opacity-50' : 'opacity-100'
                    )}
                />

                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/40 z-40">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                )}
            </div>
        </div>
    )
}
