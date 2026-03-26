// draft.store.ts
import { create } from 'zustand'
import type { DraftDTO } from '../types/draft.types'

type EditingState = 'idle' | 'saving' | 'saved' | 'error'

type DraftStore = {
    draft: DraftDTO
    lastSavedDraft: DraftDTO
    isHydrating: boolean
    editingState: EditingState

    // actions
    setCurrentDraft: (draft: DraftDTO) => void
    updateDraft: (patch: Partial<DraftDTO>) => void
    setLastSavedDraft: (draft: DraftDTO) => void
    changeHydration: (value: boolean) => void
    handleEditingState: (state: EditingState) => void
    updateCoverImage: (coverImageUrl: string) => void
    updateEmoji: (icon: string) => void
    reset: () => void
}

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

export const useDraftStore = create<DraftStore>((set, _) => ({
    draft: initialDraft,
    lastSavedDraft: initialDraft,
    isHydrating: false,
    editingState: 'idle',

    setCurrentDraft: (draft) =>
        set({
            draft
        }),

    updateDraft: (patch) =>
        set((state) => ({
            draft: {
                ...state.draft,
                ...patch
            }
        })),

    setLastSavedDraft: (draft) =>
        set({
            lastSavedDraft: draft
        }),

    changeHydration: (value) =>
        set({
            isHydrating: value
        }),

    handleEditingState: (state) =>
        set({
            editingState: state
        }),

    reset: () =>
        set({
            draft: initialDraft,
            lastSavedDraft: initialDraft,
            isHydrating: false,
            editingState: 'idle'
        }),

    updateCoverImage: (coverImageUrl) =>
        set((state) => ({
            draft: {
                ...state.draft,
                coverImageUrl
            }
        })),

    updateEmoji: (icon) =>
        set((state) => ({
            draft: {
                ...state.draft,
                icon
            }
        }))
}))
