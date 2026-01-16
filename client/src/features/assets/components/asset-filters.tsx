import { Plus } from 'lucide-react'
import type { FC } from 'react'
import AssetOptions from './asset-options'

interface AssetFiltersProps {
    activeFilter?: string
    setActiveFilter: (filter: string) => void
}

const AssetFilters: FC<AssetFiltersProps> = ({ activeFilter, setActiveFilter }) => {
    return (
        <div className="border-b border-secondary px-6 py-4 flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-2">
                <span className="text-sm text-forground">Appearance</span>
                <span className="text-xs text-secondary">•</span>
            </div>
            {['All', 'Folders', 'Files', 'Recent'].map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap ${
                        activeFilter === filter ? 'bg-primary text-foreground' : ' text-foreground/70 hover:bg-secondary'
                    }`}>
                    {filter}
                </button>
            ))}

            <div className="flex-1" />

            <AssetOptions>
                <Plus size={16} className='hover:rotate-45 transform transition-all' />
            </AssetOptions>
        </div>
    )
}

export default AssetFilters
