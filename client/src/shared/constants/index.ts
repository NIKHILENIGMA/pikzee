export const WORKSPACE_API_BASE = '/workspaces'
export const INVITATIONS_API_BASE = '/invitations'
export const PROJECTS_API_BASE = '/projects'

interface FileItem {
    id: string
    name: string
    type: 'folder' | 'file'
    items?: number
    size?: string
    thumbnail?: string
    assetUrl?: string
    lastModified?: string
    fileSize?: number // in MB
}

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

export const assets: FileItem[] = [
    { id: '1', name: 'some thing different', type: 'folder', items: 1, fileSize: 245 },
    { id: '2', name: 'private', type: 'folder', items: 0, fileSize: 0 },
    { id: '3', name: 'Graphic', type: 'folder', items: 7, fileSize: 1234 },
    { id: '4', name: 'Sound Effects', type: 'folder', items: 10, fileSize: 567 },
    { id: '5', name: 'Footage', type: 'folder', items: 20, fileSize: 5678 },
    { id: '6', name: 'Footage', type: 'folder', items: 20, fileSize: 5678 },
    { id: '7', name: 'Footage', type: 'folder', items: 20, fileSize: 5678 },
    {
        id: '8',
        name: 'ICE_Cream_Truck.mp4',
        type: 'file',
        fileSize: 5678,
        assetUrl: 'https://www.pexels.com/download/video/35519196/',
        thumbnail:
            'https://plus.unsplash.com/premium_photo-1670055280031-764eb9f017b7?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: '6',
        name: 'DRYP_30_FINAL_9x16.mp4',
        type: 'file',
        fileSize: 450,
        assetUrl: 'https://www.pexels.com/download/video/1858244/',
        thumbnail:
            'https://images.unsplash.com/photo-1543470388-80a8f5281639?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGljZXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: '7',
        name: 'DRYP_30_FINAL_4x5.mp4',
        type: 'file',
        fileSize: 380,
        assetUrl: 'https://www.pexels.com/download/video/3723069/',
        thumbnail:
            'https://images.unsplash.com/photo-1517032880222-1afedf8c9d0d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGljZXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: '8',
        name: 'DRYP_30_4K_H265_Final.mp4',
        type: 'file',
        fileSize: 1200,
        assetUrl: 'https://www.pexels.com/download/video/4434241/',
        thumbnail:
            'https://plus.unsplash.com/premium_photo-1670055280031-764eb9f017b7?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: '9',
        name: 'DRYP_15_FINAL_9x16.mp4',
        type: 'file',
        fileSize: 320,
        assetUrl: 'https://www.pexels.com/download/video/3700846/',
        thumbnail:
            'https://images.unsplash.com/photo-1519873174361-37788c5a73c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdhdGVyfGVufDB8fDB8fHww'
    },
    { id: '10', name: 'DRYP_15_FINAL_4x5.mp4', type: 'file', fileSize: 280 },
    { id: '11', name: 'Extra_footage.mp4', type: 'file', fileSize: 890 }
]
