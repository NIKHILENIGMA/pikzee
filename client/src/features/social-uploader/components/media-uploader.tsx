import { useState, useCallback, useRef, type FC } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

const UploadIcon: FC = () => (
    <svg
        className="h-6 w-6 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
    </svg>
)

const ImageIcon = () => (
    <svg
        className="h-6 w-6 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            ry="2"></rect>
        <circle
            cx="8.5"
            cy="8.5"
            r="1.5"></circle>
        <polyline points="21,15 16,10 5,21"></polyline>
    </svg>
)

const VideoIcon = () => (
    <svg
        className="h-6 w-6 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect
            x="1"
            y="5"
            width="15"
            height="14"
            rx="2"
            ry="2"></rect>
    </svg>
)

const XIcon = () => (
    <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"></line>
        <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"></line>
    </svg>
)

interface MediaUploaderProps {
    onUpload: (file: File, url: string) => void
    currentMedia?: string
    compact?: boolean
}

export function MediaUploader({ onUpload, currentMedia, compact = false }: MediaUploaderProps) {
    const [isDragActive, setIsDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (files && files.length > 0) {
                const file = files[0]
                // Check if file is image or video
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    const url = URL.createObjectURL(file)
                    onUpload(file, url)
                }
            }
        },
        [onUpload]
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragActive(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragActive(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragActive(false)
            handleFiles(e.dataTransfer.files)
        },
        [handleFiles]
    )

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files)
        },
        [handleFiles]
    )

    const handleRemoveMedia = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUpload(null as any, '')
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    if (currentMedia) {
        const isVideo = currentMedia.includes('video') || currentMedia.endsWith('.mp4') || currentMedia.endsWith('.mov')

        return (
            <div className="relative">
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    {isVideo ? (
                        <video
                            src={currentMedia}
                            className={cn('w-full object-cover', compact ? 'h-24' : 'h-48')}
                            controls
                        />
                    ) : (
                        <img
                            src={currentMedia || '/placeholder.svg'}
                            alt="Uploaded media"
                            className={cn('w-full object-cover', compact ? 'h-24' : 'h-48')}
                        />
                    )}
                    <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveMedia}>
                        <XIcon />
                    </Button>
                </div>
                {!compact && (
                    <div className="mt-3 flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUploadClick}>
                            Replace Media
                        </Button>
                        <Button
                            variant="outline"
                            size="sm">
                            Select from Library
                        </Button>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileInput}
                    className="hidden"
                />
            </div>
        )
    }

    if (compact) {
        return (
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
                    isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
                )}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileInput}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <UploadIcon />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{isDragActive ? 'Drop here' : 'Drag & drop media'}</p>
                        <p className="text-xs text-muted-foreground">Up to 100MB</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
            )}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileInput}
                className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                    <div className="p-3 bg-gray-100 rounded-full">
                        <UploadIcon />
                    </div>
                    <div className="p-3 bg-gray-100 rounded-full">
                        <ImageIcon />
                    </div>
                    <div className="p-3 bg-gray-100 rounded-full">
                        <VideoIcon />
                    </div>
                </div>
                <div>
                    <p className="text-lg font-medium">{isDragActive ? 'Drop your media here' : 'Drag & drop your media here'}</p>
                    <p className="text-sm text-muted-foreground mt-1">Supports images and videos up to 100MB</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleUploadClick}>
                        Upload from System
                    </Button>
                    <Button variant="outline">Select from App Library</Button>
                </div>
            </div>
        </div>
    )
}
