import { Grid, List, Filter, ArrowUpDown } from 'lucide-react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { ProjectView } from '../types'

interface FilterBarProps {
    view: ProjectView
    onViewChange: (view: ProjectView) => void
}

export function FilterBar({ view, onViewChange }: FilterBarProps) {
    return (
        <div className="flex items-center justify-start space-x-4 border-b border-border pb-5 flex-shrink-0 px-8">
            <Tabs
                value={view}
                onValueChange={(value) => onViewChange(value as ProjectView)}>
                <TabsList className="bg-card border-0 p-1">
                    <TabsTrigger
                        value="GRID"
                        className=" h-8 px-3">
                        <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="LIST"
                        className=" h-8 px-3">
                        <List className="h-4 w-4" />
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Filter */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
                <Filter className="h-4 w-4" />
                <span className="text-gray-400">Filtered by</span>
                <span className="text-white font-medium">Active Projects</span>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-gray-400">Sorted by</span>
                <span className="text-white font-medium">Name</span>
            </div>
        </div>
    )
}
