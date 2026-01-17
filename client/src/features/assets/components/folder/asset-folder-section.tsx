import { Folder } from 'lucide-react'
import type { FC } from 'react'

import { Checkbox } from '@/components/ui/checkbox'

import AssetFolder from './asset-folder'

interface AssetFolderSectionProps {
    items: any[]
    stats: {
        totalFolders: number
        totalSizeMB: number
    }
    selection: {
        selectedItems: Set<string>
        setSelectedItems: (items: Set<string>) => void
    }
}

const AssetFolderSection: FC<AssetFolderSectionProps> = ({ items, stats, selection }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-foreground/85">
                    <Checkbox className="data-[state=checked]:border-border data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-foreground" />
                    <Folder size={16} />
                    <span>
                        {stats.totalFolders} Folders • {stats.totalSizeMB.toFixed(1)} GB
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items
                    .filter((item) => item.type === 'folder')
                    .map((item) => (
                        <AssetFolder
                            key={item.id}
                            selected={selection.selectedItems.has(item.id)}
                            item={item}
                        />
                    ))}
            </div>
        </div>
    )
}

export default AssetFolderSection
