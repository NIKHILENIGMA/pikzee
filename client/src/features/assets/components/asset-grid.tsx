import { useState, type FC } from 'react'

import { Separator } from '@/components/ui/separator'

import AssetFileSection from './file/asset-file-section'
import AssetFolderSection from './folder/asset-folder-section'
import AssetGridContext from './asset-grid-context'

import { useStatsCalculation } from '../hooks/use-stats-calculation'
import type { AssetContextType } from '../types/assets'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/shared/lib/utils'

interface AssetGridProps {
    selectedItems: Set<string>
    setSelectedItems: (items: Set<string>) => void
    assets: AssetContextType[]
}

const AssetGrid: FC<AssetGridProps> = ({ selectedItems, setSelectedItems, assets }) => {
    const { totalFiles, totalFolders, folderStats, fileStats } = useStatsCalculation(assets)
    const [files, setFiles] = useState<File[]>([])

    const onDrop = (acceptedFiles: File[]) => {
        setFiles((prev) => (prev ? [...prev, ...acceptedFiles] : acceptedFiles))
    }

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        multiple: true,
        maxSize: 5 * 1024 * 1024, // 5MB
        accept: {
            'image/*': []
        }
    })

    return (
        <>
            {assets.length === 0 ? (
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
                                <p className="text-base text-foreground/90">
                                    
                                </p>
                            ) : (
                                <p className="text-sm text-foreground/85">
                                    Drag & drop files here, or click to select files <br /> (Only images under 5MB are accepted)
                                </p>
                            )}
                            <Button variant="default">+ Upload</Button>
                            {isDragReject && (
                                <p className="text-sm text-red-500">
                                    Some files were rejected. Please upload valid image files under 5MB.{' '}
                                    <span
                                        onClick={() => {
                                            setFiles([])
                                        }}>
                                        Undo
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <AssetGridContext>
                    <div className="flex-1 overflow-y-auto p-6">
                        <AssetFolderSection
                            items={totalFolders}
                            stats={{
                                totalFolders: folderStats.count,
                                totalSizeMB: folderStats.sizeGB
                            }}
                            selection={{ selectedItems, setSelectedItems }}
                        />
                        {totalFiles.length > 0 && <Separator className="my-4" />}

                        <AssetFileSection
                            items={totalFiles}
                            stats={{
                                totalFiles: fileStats.count,
                                totalSizeMB: fileStats.sizeGB
                            }}
                            selection={{ selectedItems, setSelectedItems }}
                        />
                    </div>
                </AssetGridContext>
            )}
        </>
    )
}

export default AssetGrid
