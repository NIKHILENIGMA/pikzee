import { useState, type FC } from 'react'

// import AssetActionbar from './asset-actionbar'
import AssetBreadcrumb from './asset-breadcrumb'
import AssetFilters from './asset-filters'
import AssetGrid from './asset-grid'
import type { AssetContextType } from '../types/assets'
import AssetSidebar from './asset-sidebar'

interface AssetContentProps {
    sidebarOpen: boolean
    onSidebarToggle: () => void
    assets: AssetContextType[]
}

const AssetContent: FC<AssetContentProps> = ({ sidebarOpen, onSidebarToggle, assets }) => {
    const [activeFilter, setActiveFilter] = useState('All')
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

    return (
        <main className="flex-1 flex flex-col">
            <AssetBreadcrumb
                sidebarOpen={sidebarOpen}
                onSidebarToggle={onSidebarToggle}
                items={assets}
            />

            <AssetFilters
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            />
            <div className="flex flex-1 overflow-hidden">
                <AssetSidebar sidebarOpen={sidebarOpen} />

                <AssetGrid
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    assets={assets}
                />
            </div>

            {/* {selectedItems.size > 0 && (
                <AssetActionbar
                    selectedItems={selectedItems}
                    fileItems={assets}
                    sidebarOpen={sidebarOpen}
                    setSelectedItems={setSelectedItems}
                />
            )} */}
        </main>
    )
}

export default AssetContent
