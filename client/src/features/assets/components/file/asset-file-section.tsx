import { File } from 'lucide-react'
import type { FC } from 'react'

import { Checkbox } from '@/components/ui/checkbox'

import AssetFile from './asset-file'
import type { AssetContextType } from '../../types/assets'

interface AssetFileSectionProps {
    items: AssetContextType[]
    stats: {
        totalFiles: number
        totalSizeMB: number
    }
    selection: {
        selectedItems: Set<string>
        setSelectedItems: (items: Set<string>) => void
    }
}

const AssetFileSection: FC<AssetFileSectionProps> = ({ items, stats, selection }) => {
    return (
        <div>
            {items.filter((f) => f.type === 'FILE').length > 0 && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/85">
                        <Checkbox className="data-[state=checked]:border-border data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-foreground" />
                        <File size={16} />
                        <span>
                            {stats.totalFiles} Assets • {stats.totalSizeMB.toFixed(1)} GB{' '}
                        </span>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items
                    .filter((item) => item.type === 'FILE')
                    .map((item) => (
                        <AssetFile
                            item={item}
                            selectedItems={selection.selectedItems}
                        />
                    ))}
            </div>
        </div>
    )
}

export default AssetFileSection
