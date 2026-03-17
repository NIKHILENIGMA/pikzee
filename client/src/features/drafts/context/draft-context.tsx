import { useState } from 'react'
import { DraftContext } from '../hooks/use-draft-context'
import type { DraftDTO } from '../types/draft.types'

export type DraftContextType = {
    draft: DraftDTO
    updateDraft: (data: Partial<DraftDTO>) => void
}

const initialDraft: DraftDTO = {
    id: '',
    ownerId: '',
    title: '',
    docId: '',
    content: '',
    icon: null,
    coverImageUrl: null,
    coverImageConfig: null,
    settings: null,
    lastUpdatedBy: '',
    createdAt: new Date(),
    updatedAt: new Date()
}

export function DraftProvider({ children }: { children: React.ReactNode }) {
    const [draft, setDraft] = useState<DraftDTO>(initialDraft)

    function updateDraft(data: Partial<DraftDTO>) {
        setDraft((prev) => (prev ? { ...prev, ...data } : (data as DraftDTO)))
    }

    const value = { draft, updateDraft }

    return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
}
