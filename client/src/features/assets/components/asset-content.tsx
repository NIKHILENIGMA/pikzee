import { useState, type FC } from 'react'

import AssetActionbar from './asset-actionbar'
import AssetBreadcrumb from './asset-breadcrumb'
import AssetFilters from './asset-filters'
import AssetGrid from './asset-grid'
import { assets } from '@/shared/constants'

interface FileItem {
    id: string
    name: string
    type: 'folder' | 'file'
    items?: number
    size?: string
    thumbnail?: string
    assetUrl?: string
    lastModified?: string
    fileSize?: number // in MB
}

interface AssetContentProps {
    sidebarOpen: boolean
    onSidebarToggle: () => void
}

const AssetContent: FC<AssetContentProps> = ({ sidebarOpen, onSidebarToggle }) => {
    const [activeFilter, setActiveFilter] = useState('All')
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const fileItems: FileItem[] = assets

    return (
        <main className="flex-1 flex flex-col">
            <AssetBreadcrumb
                sidebarOpen={sidebarOpen}
                onSidebarToggle={onSidebarToggle}
            />
            <AssetFilters
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            />

            <AssetGrid
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                fileItems={fileItems}
            />

            {selectedItems.size > 0 && (
                <AssetActionbar
                    selectedItems={selectedItems}
                    fileItems={fileItems}
                    sidebarOpen={sidebarOpen}
                    setSelectedItems={setSelectedItems}
                />
            )}
        </main>
    )
}

export default AssetContent
