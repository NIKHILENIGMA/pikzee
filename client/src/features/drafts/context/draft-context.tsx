import { useState } from 'react'
import { DraftContext } from '../hooks/use-draft-context'
import type { DraftDTO, EditingStateType } from '../types/draft.types'

const initialDraft: DraftDTO = {
    id: '',
    owner: {
        id: '',
        firstName: '',
        lastName: '',
        avatarUrl: null
    },
    title: null,
    docId: '',
    content: null,
    icon: null,
    coverImageUrl: null,
    coverImageConfig: null,
    settings: null,
    lastUpdatedBy: {
        id: '',
        firstName: '',
        lastName: '',
        avatarUrl: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
}

export function DraftProvider({ children }: { children: React.ReactNode }) {
    const [draft, setDraft] = useState<DraftDTO>(initialDraft)
    const [lastSavedDraft, setLastSavedDraft] = useState<DraftDTO>(initialDraft)
    const [isHydrating, setIsHydrating] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<{
        type: EditingStateType
        timestamp: number
    }>({
        type: 'idle',
        timestamp: Date.now()
    })

    const setCurrentDraft = (draft: DraftDTO) => {
        setDraft(draft) // Set the current draft in state
        setLastSavedDraft(draft) // Also update the last saved draft
    }

    const updateEmoji = (icon: string | null) => {
        setDraft((prev) => (prev ? { ...prev, icon } : prev))
    }

    const updateCoverImage = (coverImageUrl: string | null) => {
        setDraft((prev) => (prev ? { ...prev, coverImageUrl } : prev))
    }

    const updateDraft = (data: Partial<DraftDTO>) => {
        setDraft((prev) => (prev ? { ...prev, ...data } : (data as DraftDTO)))
    }

    const changeHydration = (isHydrating: boolean) => {
        setIsHydrating(isHydrating)
    }

    const handleEditingState = (type: EditingStateType) => {
        setIsEditing({ type, timestamp: Date.now() })
    }

    const reset = () => {
        setDraft(initialDraft)
        setLastSavedDraft(initialDraft)
        setIsHydrating(false)
        setIsEditing({ type: 'idle', timestamp: Date.now() })
    }

    const value = {
        draft,
        updateDraft,
        setCurrentDraft,
        changeHydration,
        setLastSavedDraft,
        reset,
        isHydrating,
        lastSavedDraft,
        updateEmoji,
        updateCoverImage,
        handleEditingState,
        isEditing
    }

    return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
}
