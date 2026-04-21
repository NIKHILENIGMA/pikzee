import { useCallback, useRef, useState, type FC } from 'react'
import { useDropzone } from 'react-dropzone'

import { Separator } from '@/components/ui/separator'

import AssetFileSection from './file/asset-file-section'
import AssetFolderSection from './folder/asset-folder-section'
import AssetGridContext from './asset-grid-context'

import type { Files, Folders } from '../types/assets'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { useConfirmUpload, useInitiateUpload } from '../api/create-file'
import { useQueryClient } from '@tanstack/react-query'
import client from '@/shared/lib/api-client'
import { PROJECTS_API_BASE } from '@/shared/constants'

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


const AssetGrid: FC<AssetGridProps> = ({ projectId, folderId, subfolders, assets, navigateToFolder }) => {
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
    const queryClient = useQueryClient()
    const { mutateAsync: initiateUpload } = useInitiateUpload({})
    const { mutateAsync: confirmUpload } = useConfirmUpload({})
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Folder creation handler
    const handleCreateFolder = async (folderName: string) => {
        try {
            // Call your backend API to create a folder
            await client.post(`${PROJECTS_API_BASE}/${projectId}/assets/folders`, {
                name: folderName,
                parentId: folderId || null
            })
            // Refresh folder contents
            queryClient.invalidateQueries({
                queryKey: ['folder-contents', projectId, folderId]
            })
        } catch (err) {
            // Optionally show error to user
            console.error('Failed to create folder', err)
        }
    }

    // File upload trigger handler
    const handleUploadFile = () => {
        // Programmatically open the dropzone file picker
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

    return (
        <>
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
            {assets.length === 0 && subfolders.length === 0 ? (
                <div className="flex flex-1  items-center justify-center h-full px-5 py-2">
                    <div
                        {...getRootProps()}
                        className={cn(
                            'w-full h-[85%] text-center border-2 border-dashed border-accent p-8 rounded-md bg-accent/50 flex items-center justify-center gap-4',
                            isDragActive ? 'border-primary bg-primary/30' : '',
                            isDragReject ? 'border-red-200/30 bg-red-600/10' : ''
                        )}>
                        <div className="flex flex-col items-center gap-4">
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p className="text-base text-foreground/90"></p>
                            ) : (
                                <p className="text-sm text-foreground/85">
                                    Drag & drop files here, or click to select files <br /> (Only images under 5MB are accepted)
                                </p>
                            )}
                            <Button variant="default" onClick={handleUploadFile}>+ Upload</Button>
                            {isDragReject && (
                                <p className="text-sm text-red-500">
                                    Some files were rejected. Please upload valid image files under 5MB.{' '}
                                    <span
                                        onClick={() => {
                                            setUploadProgress({
                                                ...uploadProgress
                                            })
                                        }}>
                                        Undo
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <AssetGridContext onCreateFolder={handleCreateFolder} onUploadFile={handleUploadFile}>
                    <div className="flex-1 overflow-y-auto p-6">
                        <AssetFolderSection items={subfolders} navigateToFolder={navigateToFolder} />

                        {subfolders.length > 0 && <Separator className="my-4" />}

                        <AssetFileSection
                            items={assets}
                            progress={uploadProgress}
                        />
                    </div>
                </AssetGridContext>
            )}
        </>
    )
}

export default AssetGrid
