export type Platforms = 'YOUTUBE' | 'TWITTER' | 'LINKEDIN'

export type Account = {
    id: string
    status: 'CONNECTED' | 'EXPIRED' | 'REVOKED'
    platform: Platforms
    platformUserId: string
    avatarUrl?: string | null
    coverUrl?: string | null
    accountName: string
    createdAt: Date
}

export interface HistoryItem {
    id: string
    title: string
    description: string
    platform: string
    publishDate: string
    thumbnail?: string
}
