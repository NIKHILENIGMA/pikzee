export type EditingStateType = 'typing' | 'saving' | 'saved' | 'error' | 'idle'

export type DraftContextType = {
    draft: DraftDTO
    lastSavedDraft: DraftDTO
    isHydrating: boolean
    isEditing: {
        type: EditingStateType
        timestamp: number
    }

    updateDraft: (data: Partial<DraftDTO>) => void
    setCurrentDraft: (draft: DraftDTO) => void
    changeHydration: (isHydrating: boolean) => void
    setLastSavedDraft: (draft: DraftDTO) => void
    updateEmoji: (icon: string | null) => void
    updateCoverImage: (coverImageUrl: string | null) => void
    handleEditingState: (state: EditingStateType) => void
    reset: () => void
}

export type FontStyle = 'sans' | 'serif' | 'mono'
export type FontSize = '16px' | '25px' | '36px'
export type PageWidth = 'default' | 'full'

export type DraftSettingType = {
    fontStyle: FontStyle
    fontSize: FontSize
    isFullWidth: boolean
    showCover: boolean
    showIcon: boolean
    showOwner: boolean
    showLastModified: boolean
}

export type DraftCoverImageConfig = {
    type: 'S3' | 'URL' | 'unsplash'
    positionY: number
    focalPoint: {
        x: number
        y: number
    } | null
}

export type DraftSidebarDTO = {
    id: string
    title: string | null
    icon: string | null
    updatedAt: Date
}

export type DraftSettings = {
    fontStyle: FontStyle
    fontSize: FontSize
    isFullWidth: boolean
    showCover: boolean
    showIcon: boolean
    showOwner: boolean
    showLastModified: boolean
}

export type DraftDTO = {
    id: string
    docId: string
    title: string | null
    content: string | null
    icon: string | null
    coverImageUrl: string | null
    coverImageConfig: {
        type: 'S3' | 'URL' | 'unsplash'
        positionY: number
        focalPoint: {
            x: number
            y: number
        } | null
    } | null
    settings: {
        fontSize: '16px'
        fontStyle: 'sans'
        isFullWidth: boolean
        showCover: boolean
        showOwner: boolean
        showLastModified: boolean
        showIcon: boolean
    } | null
    createdAt: Date
    updatedAt: Date
    owner: {
        id: string
        firstName: string
        lastName: string
        avatarUrl: string | null
    }
    lastUpdatedBy: {
        id: string
        firstName: string
        lastName: string
        avatarUrl: string | null
    }
}


