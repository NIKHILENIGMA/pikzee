import { type FC } from 'react'

import { Separator } from '@/components/ui/separator'

import AssetFileSection from './file/asset-file-section'
import AssetFolderSection from './folder/asset-folder-section'
import AssetGridContext from './asset-grid-context'

import { useStatsCalculation } from '../hooks/use-stats-calculation'

interface AssetGridProps {
    selectedItems: Set<string>
    setSelectedItems: (items: Set<string>) => void
    fileItems: {
        id: string
        name: string
        type: 'file' | 'folder'
        fileSize?: number
        items?: number
    }[]
}

const AssetGrid: FC<AssetGridProps> = ({ selectedItems, setSelectedItems, fileItems }) => {
    const { totalFiles, totalFolders, folderStats, fileStats } = useStatsCalculation(fileItems)

    return (
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
    )
}

export default AssetGrid
