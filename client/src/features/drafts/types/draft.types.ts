export type DraftSettings = {
    fontStyle: string
    fontSize: string
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

export type DraftDTO = {
    id: string
    ownerId: string
    title: string | null
    docId: string
    content: unknown
    icon: string | null
    coverImageUrl: string | null
    coverImageConfig: DraftCoverImageConfig | null
    settings: DraftSettings | null
    lastUpdatedBy: string
    createdAt: Date
    updatedAt: Date
}
