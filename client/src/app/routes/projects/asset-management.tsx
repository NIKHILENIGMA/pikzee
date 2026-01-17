import { ChevronRight, Folder } from 'lucide-react'
import { useState } from 'react'

import AssetContent from '@/features/assets/components/asset-content'
import AssetSidebar from '@/features/assets/components/asset-sidebar'
import { sidebarItems, type SidebarItem } from '@/shared/constants'

export default function AssetManagement() {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']))

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)

    const toggleFolder = (folderId: string) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId)
        } else {
            newExpanded.add(folderId)
        }
        setExpandedFolders(newExpanded)
    }

    const renderSidebarItems = (items: SidebarItem[], level = 0) => {
        return items.map((item) => {
            const isExpanded = expandedFolders.has(item.id)
            return (
                <div key={item.id}>
                    <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors ${
                            item.id === 'youtube' ? 'bg-accent' : ''
                        }`}
                        style={{ paddingLeft: `${12 + level * 12}px` }}>
                        {item.children && item.children.length > 0 && (
                            <button
                                onClick={() => toggleFolder(item.id)}
                                className="p-0 hover:bg-secondary rounded">
                                <ChevronRight
                                    size={16}
                                    className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                />
                            </button>
                        )}
                        {!item.children && <div className="w-4" />}
                        <Folder
                            size={16}
                            className="text-primary"
                        />
                        <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    {item.children && isExpanded && renderSidebarItems(item.children, level + 1)}
                </div>
            )
        })
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <AssetSidebar
                sidebarOpen={sidebarOpen}
                renderSidebarItems={renderSidebarItems}
                sidebarItems={sidebarItems}
            />
            <AssetContent
                sidebarOpen={sidebarOpen}
                onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            />
        </div>
    )
}
