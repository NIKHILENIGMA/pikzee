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
    }
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
    title: string
    content: string
    icon: string | null
    coverImageUrl: string | null
    coverImageConfig: object | null
    settings: DraftSettings | null
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
