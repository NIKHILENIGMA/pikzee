import { type FC } from 'react'
import { useSearchParams } from 'react-router'

import { useContent } from '../api/get-content'
import AssetBreadcrumb from './asset-breadcrumb'
import AssetGrid from './asset-grid'
import AssetSidebar from './asset-sidebar'

interface AssetContentProps {
    projectId: string
}

const AssetContent: FC<AssetContentProps> = ({ projectId }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentFolderId = searchParams.get('folderId')
    const { data: folderContent, isPending } = useContent({
        projectId,
        folderId: currentFolderId || null
    })

    const navigateToFolder = (folderId: string | null) => {
        if (folderId) {
            setSearchParams({ folderId })
        } else {
            setSearchParams({}) // Navigate to Root
        }
    }

    if (isPending) {
        return (
            <div className="w-full  h-screen flex items-center justify-center">
                <p className="text-foreground/90">Loading assets...</p>
            </div>
        )
    }

    return (
        <main className="flex-1 flex flex-col">
            <AssetBreadcrumb
                breadcrumb={folderContent?.breadcrumbs || []}
                navigateToFolder={navigateToFolder}
            />

            {/* <AssetFilters
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
            /> */}
            <div className="flex flex-1 overflow-hidden">
                <AssetSidebar />

                <AssetGrid
                    projectId={projectId}
                    folderId={currentFolderId}
                    subfolders={folderContent?.subfolders || []}
                    assets={folderContent?.assets || []}
                    navigateToFolder={navigateToFolder}
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
