import { useMemo } from 'react'
import type { AssetContextType } from '../types/assets'

export const useStatsCalculation = (fileItems: AssetContextType[]) => {
    const { totalFiles, totalFolders, folderStats, fileStats } = useMemo(() => {

        const totalFolders = fileItems.filter((item) => item.type === 'FOLDER')
        const totalFiles = fileItems.filter((item) => item.type === 'FILE')

        const size = (items: typeof fileItems) => items.reduce((acc, curr) => acc + (curr.fileSizeBytes || 0), 0)
        
        return {
            totalFolders,
            totalFiles,
            folderStats: {
                count: totalFolders.length,
                sizeGB: Number((size(totalFolders) / 1024).toFixed(1))
            },
            fileStats: {
                count: totalFiles.length,
                sizeGB: Number((size(totalFiles) / 1024).toFixed(1))
            }
        }
    }, [fileItems])

    return { totalFiles, totalFolders, folderStats, fileStats }
}
