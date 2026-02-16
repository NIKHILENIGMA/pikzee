import { Plus } from 'lucide-react'
import type { FC } from 'react'

import { cn } from '@/shared/lib/utils'

interface AssetSidebarProps {
    sidebarOpen: boolean
}

const AssetSidebar: FC<AssetSidebarProps> = ({ sidebarOpen }) => {
    return (
        <aside
            className={cn(
                'sticky w-64 h-full border-r border-secondary overflow-y-auto flex flex-col transition-all  ease-in-out',
                !sidebarOpen ? '-translate-x-full absolute ' : 'relative'
            )}>
            <div className="p-4 border-b border-secondary">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-foreground">Assets</h2>
                    <button className="p-1 hover: rounded transition-colors">
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default AssetSidebar
