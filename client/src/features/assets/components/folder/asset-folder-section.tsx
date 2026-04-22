// import { Folder } from 'lucide-react'
import type { FC } from 'react'

// import { Checkbox } from '@/components/ui/checkbox'

import AssetFolder from './asset-folder'
import type { Folders } from '../../types/assets'

interface AssetFolderSectionProps {
    items: Folders[]
    navigateToFolder?: (folderId: string | null) => void
}

const AssetFolderSection: FC<AssetFolderSectionProps> = ({ items, navigateToFolder }) => {
    return (
        <div className="mb-8">
            {/* <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-foreground/85">
                    <Checkbox className="data-[state=checked]:border-border data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-foreground" />
                    <Folder size={16} />
                </div>
            </div> */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                    <AssetFolder
                        key={item.id}
                        // selected={selection.selectedItems.has(item.id)}
                        item={item}
                        navigateToFolder={navigateToFolder}
                    />
                ))}
            </div>
        </div>
    )
}

export default AssetFolderSection
