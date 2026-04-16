import type { StateCreator } from 'zustand'

type SyncStatus = 'idle' | 'saving' | 'saved' | 'error'

type MetaData = {
    title: string
    icon: string | null
}

export interface DraftSlice {
    // Current draft being edited
    activeDocumentId: string | null
    setActiveDocumentId: (id: string | null) => void

    // Title and icon that are being optimistically updated in the UI before the server confirms the changes
    optimisticMeta: MetaData | null
    setOptimisticMeta: (meta: MetaData) => void

    // The current state of the draft being edited
    syncStatus: SyncStatus
    setSyncStatus: (status: SyncStatus) => void

    // Sidebar state
    isEditorSidebarOpen: boolean
    toggleEditorSidebar: () => void

    isEditorSettingsOpen: boolean
    toggleEditorSettings: () => void
}

export const createDraftSlice: StateCreator<DraftSlice> = (set) => ({
    activeDocumentId: null,
    setActiveDocumentId: (id) => set({ activeDocumentId: id }),

    optimisticMeta: null,
    setOptimisticMeta: (meta) => set({ optimisticMeta: meta }),

    syncStatus: 'idle',
    setSyncStatus: (status) => set({ syncStatus: status }),

    isEditorSidebarOpen: true,
    toggleEditorSidebar: () =>
        set((state) => ({
            isEditorSidebarOpen: !state.isEditorSidebarOpen
        })),

    isEditorSettingsOpen: false,
    toggleEditorSettings: () =>
        set((state) => ({
            isEditorSettingsOpen: !state.isEditorSettingsOpen
        }))
})
