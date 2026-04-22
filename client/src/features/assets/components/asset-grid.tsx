import { useCallback, useRef, useState, type FC } from 'react'
import { useDropzone, type DropzoneRootProps, type DropzoneInputProps } from 'react-dropzone'

import { Separator } from '@/components/ui/separator'

import AssetFileSection from './file/asset-file-section'
import AssetFolderSection from './folder/asset-folder-section'
import AssetGridContext, { useAssetGridContext } from './asset-grid-context'
import AssetActions from './asset-actions'

import type { Files, Folders } from '../types/assets'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { useConfirmUpload, useInitiateUpload } from '../api/create-file'
import { useQueryClient } from '@tanstack/react-query'
import client from '@/shared/lib/api-client'
import { PROJECTS_API_BASE } from '@/shared/constants'
import { FolderPlus, Upload } from 'lucide-react'

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'application/pdf',
    'text/plain',
    'audio/mpeg',
    'audio/webm'
] as const

type AllowedMimeType = (typeof allowedMimeTypes)[number]

const isAllowedMimeType = (mimeType: string): mimeType is AllowedMimeType => (allowedMimeTypes as readonly string[]).includes(mimeType)

interface AssetGridProps {
    projectId: string
    folderId: string | null
    subfolders: Folders[]
    assets: Files[]
    navigateToFolder?: (folderId: string | null) => void
}

interface AssetEmptyStateProps {
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T
    isDragActive: boolean
    isDragReject: boolean
}

const AssetEmptyState: FC<AssetEmptyStateProps> = ({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
    const { handleCreateFolder, handleUploadFile } = useAssetGridContext()

    return (
        <div className="flex flex-1 items-center justify-center w-full h-full px-5 py-2">
            <div
                {...getRootProps()}
                className={cn(
                    'w-full h-[85%] text-center border-2 border-dashed border-accent p-8 rounded-md bg-accent/50 flex items-center justify-center transition-colors',
                    isDragActive ? 'border-primary bg-primary/30' : '',
                    isDragReject ? 'border-red-500/30 bg-red-600/10' : ''
                )}>
                <div className="flex flex-col items-center gap-6 max-w-md">
                    <input {...getInputProps()} />
                    
                    <div className="space-y-2 ">
                        {isDragActive ? (
                            <p className="text-lg font-medium text-primary">Drop files here to upload</p>
                        ) : (
                            <>
                                <p className="text-lg font-medium text-foreground/90">Your asset library is empty</p>
                                <p className="text-sm text-foreground/70">
                                    Drag & drop files here, or use the buttons below to get started.
                                    <br />
                                    Supports images, videos, documents, and audio.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="default" onClick={handleUploadFile} className="gap-2">
                            <Upload className="w-4 h-4" />
                            Upload File
                        </Button>
                        <Button variant="outline" onClick={handleCreateFolder} className="gap-2">
                            <FolderPlus className="w-4 h-4" />
                            Create Folder
                        </Button>
                    </div>

                    {isDragReject && (
                        <p className="text-sm text-red-500 font-medium">
                            Some files were rejected. Please check file types and sizes.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}


const AssetGrid: FC<AssetGridProps> = ({ projectId, folderId, subfolders, assets, navigateToFolder }) => {
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
    const queryClient = useQueryClient()
    const { mutateAsync: initiateUpload } = useInitiateUpload({})
    const { mutateAsync: confirmUpload } = useConfirmUpload({})
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Folder creation handler
    const handleCreateFolder = async (folderName: string) => {
        try {
            await client.post(`${PROJECTS_API_BASE}/${projectId}/assets/folders`, {
                name: folderName,
                parentId: folderId || null
            })
            queryClient.invalidateQueries({
                queryKey: ['folder-contents', projectId, folderId]
            })
        } catch (err) {
            console.error('Failed to create folder', err)
        }
    }

    // File upload trigger handler
    const handleUploadFile = () => {
        fileInputRef.current?.click()
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            for (const file of acceptedFiles) {
                if (!isAllowedMimeType(file.type)) continue

                try {
                    setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
                    const { url, assetId } = await initiateUpload({
                        projectId,
                        folderId: folderId || undefined,
                        filename: file.name,
                        mimeType: file.type as AllowedMimeType,
                        sizeBytes: file.size
                    })

                    await new Promise<void>((resolve, reject) => {
                        const xhr = new XMLHttpRequest()
                        xhr.open('PUT', url, true)
                        xhr.setRequestHeader('Content-Type', file.type)
                        xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                                const percent = Math.round((event.loaded / event.total) * 100)
                                setUploadProgress((prev) => ({
                                    ...prev,
                                    [file.name]: percent
                                }))
                            }
                        }
                        xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                resolve()
                            } else {
                                reject(new Error('Upload failed'))
                            }
                        }
                        xhr.onerror = () => reject(new Error('Upload error'))
                        xhr.send(file)
                    })

                    await confirmUpload({
                        projectId,
                        assetId
                    })
                    queryClient.invalidateQueries({
                        queryKey: ['folder-contents', projectId, folderId]
                    })
                    setUploadProgress((prev) => {
                        const updated = { ...prev }
                        delete updated[file.name]
                        return updated
                    })
                } catch (error) {
                    console.error('Upload failed:', file.name, error)
                    setUploadProgress((prev) => ({
                        ...prev,
                        [file.name]: -1
                    }))
                }
            }
        },
        [projectId, folderId, initiateUpload, confirmUpload, queryClient]
    )

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        multiple: true,
        maxSize: 5 * 1024 * 1024, // 5MB
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov'],
            'video/webm': ['.webm'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'audio/mpeg': ['.mp3'],
            'audio/webm': ['.weba']
        },
        noClick: true // Prevent default click, we trigger manually
    })

    const isEmpty = assets.length === 0 && subfolders.length === 0

    return (
        <AssetGridContext onCreateFolder={handleCreateFolder} onUploadFile={handleUploadFile}>
            <div className="flex-1 flex flex-col bg-background border border-border rounded-md overflow-hidden">
                {/* Hidden file input for programmatic file picker */}
                <input
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={e => {
                        if (e.target.files) {
                            onDrop(Array.from(e.target.files))
                            e.target.value = '' // reset input
                        }
                    }}
                    accept={allowedMimeTypes.join(',')}
                />
                
                {isEmpty ? (
                    <AssetEmptyState 
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        isDragReject={isDragReject}
                    />
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 w-full">
                        <AssetActions />
                        
                        <AssetFolderSection items={subfolders} navigateToFolder={navigateToFolder} />

                        {subfolders.length > 0 && assets.length > 0 && <Separator className="my-4" />}

                        <AssetFileSection
                            items={assets}
                            progress={uploadProgress}
                        />
                    </div>
                )}
            </div>
        </AssetGridContext>
    )
}

export default AssetGrid
