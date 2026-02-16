import { useState } from 'react'

import AssetContent from '@/features/assets/components/asset-content'

import data from '@/shared/dummy/asset.json'
import type { AssetContextType } from '@/features/assets/types/assets'
import { useParams } from 'react-router'

export default function AssetManagement() {
    const { assetId } = useParams<{ projectId: string; assetId: string }>()
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
    // Dummy data conversion
    const dataList = (data as any[]).map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
    })) as AssetContextType[]

    const filteredData = assetId !== undefined ? dataList.filter((item) => item.parentAssetId === assetId) : dataList

    return (
        <div className="flex h-screen bg-background text-foreground">
            <AssetContent
                sidebarOpen={sidebarOpen}
                onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                assets={filteredData}
                // breadCrumbItems={[]}
            />
        </div>
    )
}
