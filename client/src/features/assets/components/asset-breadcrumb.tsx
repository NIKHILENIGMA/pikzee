import { ChevronRight, Search, PanelLeft } from 'lucide-react'
import { type FC } from 'react'

import { Input } from '@/components/ui/input'

interface AssetBreadcrumbProps {
    sidebarOpen: boolean
    onSidebarToggle: () => void
}

const AssetBreadcrumb: FC<AssetBreadcrumbProps> = ({ sidebarOpen, onSidebarToggle }) => {
    return (
        <header className=" border-b border-secondary px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-foreground/85">
                    <span>All Projects</span>
                    <ChevronRight size={16} />
                    <span>Youtube Video</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search"
                            className=" w-48"
                        />
                        <Search
                            size={16}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70"
                        />
                    </div>
                    <button
                        onClick={() => onSidebarToggle()}
                        className="p-1.5 hover: rounded transition-colors"
                        title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
                        <PanelLeft
                            size={16}
                            className="cursor-pointer"
                        />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default AssetBreadcrumb
