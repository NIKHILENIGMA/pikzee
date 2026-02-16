import { type FC, type ReactNode } from 'react'

import type { AssetContextType } from '../types/assets'
import { AssetContext } from '../hooks/useAsset'

interface AssetProviderProps {
    asset: AssetContextType
    children: ReactNode
}


const AssetProvider: FC<AssetProviderProps> = ({ children, asset }) => {

    const value = asset ? {
        id: asset?.id,
        assetName: asset.assetName,
        workspaceId: asset.workspaceId,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
        projectId: asset.projectId,
        parentAssetId: asset.parentAssetId,
        type: asset.type,
    } : undefined

    return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}

export default AssetProvider
