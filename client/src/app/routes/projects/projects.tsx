import type { FC } from 'react'

import { AssetCard } from '@/features/dashboard/components/project/asset-card'
import { FolderCard } from '@/features/dashboard/components/project/folder-card'
import { SidebarNav } from '@/features/dashboard/components/project/sidebar-nav'
import { ToolbarChips } from '@/features/dashboard/components/project/toolbar-chips'
import { Topbar } from '@/features/dashboard/components/project/topbar'

type Folder = {
    id: string
    title: string
    items: number
    preview?: string[]
    locked?: boolean
}

type Asset = {
    id: string
    title: string
    duration: string
    thumb: string
}

const folders: Folder[] = [
    { id: 'f1', title: 'private', items: 0, locked: true },
    { id: 'f2', title: 'untitled folder', items: 0 },
    { id: 'f3', title: 'Graphics', items: 6 },
    { id: 'f4', title: 'Sound Effects', items: 9 },
    { id: 'f5', title: 'Footage', items: 19 }
]

const assets: Asset[] = [
    {
        id: 'a1',
        title: 'DRYP_30_FINAL_9x16.mp4',
        duration: '00:34',
        thumb: '/city-silhouette-at-dusk.jpg'
    },
    {
        id: 'a2',
        title: 'DRYP_30_FINAL_4x5.mp4',
        duration: '00:34',
        thumb: '/closeup-eye-macro.jpg'
    },
    {
        id: 'a3',
        title: 'DRYP_30_4K_H265_Final.mp4',
        duration: '00:34',
        thumb: '/logo-on-black-background.jpg'
    },
    {
        id: 'a4',
        title: 'DRYP_15_FINAL_9x16.mp4',
        duration: '00:15',
        thumb: '/pool-scene-night.jpg'
    },
    {
        id: 'a5',
        title: 'DRYP_15_FINAL_4x5.mp4',
        duration: '00:15',
        thumb: '/cinematic-bokeh.jpg'
    }
]

const Projects: FC = () => {
    return (
        <div className="h-screen w-full bg-background text-foreground minimal-scrollbar">
            <Topbar />
            <div className="flex h-[calc(100dvh-56px)]">
                <SidebarNav />
                <main className="flex-1 overflow-y-auto">
                    <div className="border-b border-border">
                        <ToolbarChips />
                    </div>

                    {/* Folders Section */}
                    <section className="px-6 py-6">
                        <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
                            <input
                                aria-label="Select folders"
                                type="checkbox"
                                className="size-4 rounded-sm border-input bg-background"
                            />
                            <span>5 Folders · 1.13 GB</span>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {folders.map((f) => (
                                <FolderCard
                                    key={f.id}
                                    title={f.title}
                                    items={f.items}
                                    locked={f.locked}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Assets Section */}
                    <section className="px-6 pb-8">
                        <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
                            <input
                                aria-label="Select assets"
                                type="checkbox"
                                className="size-4 rounded-sm border-input bg-background"
                            />
                            <span>6 Assets · 237 MB</span>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {assets.map((a) => (
                                <AssetCard
                                    key={a.id}
                                    title={a.title}
                                    duration={a.duration}
                                    thumb={a.thumb}
                                />
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default Projects
