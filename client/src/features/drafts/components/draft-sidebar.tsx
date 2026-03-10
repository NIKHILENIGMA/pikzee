// import { useQuery } from "@tanstack/react-query"
import { Plus, PanelLeft, File } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { pages } from '../constant'

export default function DraftSidebar() {
    const { documentId } = useParams()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside className={`border-r transition-all ${collapsed ? 'w-14' : 'w-64'}`}>
            <div className="flex items-center justify-between p-2">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setCollapsed(!collapsed)}>
                    <PanelLeft size={18} />
                </Button>

                {!collapsed && (
                    <Button
                        size="icon"
                        variant="ghost">
                        <Plus size={18} />
                    </Button>
                )}
            </div>

            <ScrollArea className="h-[calc(100vh-40px)]">
                <div className="space-y-1 p-2">
                    {pages.map((page: any) => (
                        <Link
                            key={page.id}
                            to={`/documents/${documentId}/pages/${page.id}`}
                            className="flex items-center gap-2 rounded p-2 hover:bg-muted">
                            <span>{page.icon ?? <File />}</span>
                            {!collapsed && <span>{page.title}</span>}
                        </Link>
                    ))}
                </div>
            </ScrollArea>
        </aside>
    )
}
