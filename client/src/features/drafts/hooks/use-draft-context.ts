import { createContext, useContext } from 'react'
import type { DraftContextType } from '../types/draft.types'

export const DraftContext = createContext<DraftContextType | null>(null)

export const useDraftContext = () => {
    const context = useContext(DraftContext)

    if (!context) {
        throw new Error('useDraftContext must be used within a DraftProvider')
    }

    return context
}
