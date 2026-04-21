import type { AssetContextType } from '@/features/assets/types/assets'

export const WORKSPACE_API_BASE = '/workspaces'
export const INVITATIONS_API_BASE = '/invitations'
export const PROJECTS_API_BASE = '/projects'
export const SOCIAL_ACCOUNTS_API_BASE = '/social'
export const DOCUMENT_API_BASE = '/documents'
export const DRAFT_API_BASE = '/drafts'
export const AI_API_BASE = '/ai'

export interface SidebarItem {
    id: string
    name: string
    icon: string
    children?: SidebarItem[]
}

export const sidebarItems: SidebarItem[] = [
    {
        id: 'youtube',
        name: 'Youtube Video',
        icon: '📹',
        children: [
            { id: 'footage', name: 'Footage', icon: '🎬' },
            { id: 'graphicssa', name: 'Graphicssa', icon: '🎨' },
            { id: 'private', name: 'private', icon: '🔒' },
            { id: 'something', name: 'some thing different', icon: '📁' },
            { id: 'sound', name: 'Sound Effects', icon: '🔊' }
        ]
    }
]

export const assets: AssetContextType[] = [
    {
        id: '880a8900-m43x-52w3-t629-344655440000',
        assetName: 'Project Assets',
        workspaceId: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        parentAssetId: null,
        type: 'FOLDER',
        path: '/assets',
        depth: 0,
        mimeType: null,
        s3Key: 'assets/',
        imagekitPath: null,
        fileSizeBytes: null,
        fileType: null,
        thumbnailPath: '',
        videoDurationSeconds: null,
        uploadStatus: 'COMPLETED',
        createdBy: 'user-JNSIBIS5asc8'
    }
]
