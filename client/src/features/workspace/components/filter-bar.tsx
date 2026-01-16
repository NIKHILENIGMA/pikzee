import { Grid, List, Filter, ArrowUpDown } from 'lucide-react'
import { type FC } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { Filters, ProjectView } from '../types'

import StatusFilter from './status-filter'
import SortFilter from './sort-filter'

interface FilterBarProps {
    view: ProjectView
    filters: Filters
    onViewChange: (view: ProjectView) => void
    onFiltersChange: (filters: Filters) => void
}

const FilterBar: FC<FilterBarProps> = ({ view, onViewChange, filters, onFiltersChange }) => {
    return (
        <div className="flex items-center justify-start space-x-4 border-b border-border pb-3 flex-shrink-0 px-8">
            <Tabs
                value={view}
                onValueChange={(value) => onViewChange(value as ProjectView)}>
                <TabsList className="bg-card border-1 ">
                    <TabsTrigger
                        value="GRID"
                        className="px-2 shadow-none">
                        <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="LIST"
                        className="px-2 shadow-none">
                        <List className="h-4 w-4" />
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Filter */}
            <StatusFilter
                status={filters.status}
                onStatusChange={(status) => onFiltersChange({ ...filters, status })}>
                <div className="ml-2 flex items-center px-2.5 py-1.5 rounded-sm gap-2 text-foreground hover:bg-accent cursor-pointer text-sm">
                    <Filter className="h-4 w-4" />
                    <div className="text-foreground/80">Filtered by</div>
                    <p className='font-medium'>{filters.status.toUpperCase()}</p>
                </div>
            </StatusFilter>
            {/* Sort */}
            <SortFilter
                order={filters.sortOrder}
                onOrderChange={(sortOrder) => onFiltersChange({ ...filters, sortOrder })}>
                <div className="ml-2 flex items-center px-2.5 py-1.5 rounded-sm gap-2 text-sm text-foreground hover:bg-accent cursor-pointer">
                    <ArrowUpDown className="h-4 w-4" />
                    <div className="text-foreground/80">Sorted by</div>
                    <p className='font-medium'>{filters.sortOrder === 'asc' ? 'A - Z' : 'Z - A'}</p>
                </div>
            </SortFilter>
        </div>
    )
}

export { FilterBar }
