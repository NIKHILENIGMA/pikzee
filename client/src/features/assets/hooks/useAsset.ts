import { createContext, useContext } from 'react'

import type { AssetContextType } from '../types/assets'

export const AssetContext = createContext<AssetContextType | null>(null)

export const useAsset = () => {
    const context = useContext(AssetContext)
    if (!context) {
        throw new Error('useAsset must be used within an AssetProvider')
    }

    return context
}
