import type { StateCreator } from 'zustand'
import type { Transformation } from '@/features/image-editor/types/image-editor'

export interface ImageSlice {
    originalPath: string
    transformations: Transformation[]

    setOriginalPath: (path: string) => void

    addTransformation: (t: Transformation) => void
    updateTransformation: (index: number, t: Transformation) => void
    removeTransformation: (index: number) => void
    reset: () => void

    isImageSidebarOpen: boolean
    toggleImageSidebar: () => void
}

export const createImageSlice: StateCreator<ImageSlice> = (set) => ({
    originalPath: '',
    transformations: [],

    setOriginalPath: (path) => set({ originalPath: path }),

    addTransformation: (t) =>
        set((state) => ({
            transformations: [...state.transformations, t]
        })),

    updateTransformation: (index, t) =>
        set((state) => ({
            transformations: state.transformations.map((item, i) => (i === index ? t : item))
        })),

    removeTransformation: (index) =>
        set((state) => ({
            transformations: state.transformations.filter((_, i) => i !== index)
        })),

    reset: () =>
        set({
            transformations: []
        }),

    isImageSidebarOpen: false,

    toggleImageSidebar: () =>
        set((state) => ({
            isImageSidebarOpen: !state.isImageSidebarOpen
        }))
})
