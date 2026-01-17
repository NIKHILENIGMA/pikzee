import { useMemo } from 'react'

export const useStatsCalculation = (fileItems: any[]) => {
    const { totalFiles, totalFolders, folderStats, fileStats } = useMemo(() => {
        const totalFolders = fileItems.filter((item) => item.type === 'folder')
        const totalFiles = fileItems.filter((item) => item.type === 'file')

        const size = (items: typeof fileItems) => items.reduce((acc, curr) => acc + (curr.fileSize || 0), 0)

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
