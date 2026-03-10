import { createContext, useContext } from 'react'
import type { DraftDTO } from '../types/draft.types'

type DraftContextType = {
    draft: DraftDTO
    updateDraft: (data: Partial<DraftDTO>) => void
}

export const DraftContext = createContext<DraftContextType | null>(null)

export const useDraftContext = () => {
    const context = useContext(DraftContext)

    if (!context) {
        throw new Error('useDraftContext must be used within a DraftProvider')
    }

    return context
}
