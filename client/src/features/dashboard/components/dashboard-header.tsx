import { Grid3X3, List } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import AddProjectCard from '@/features/dashboard/components/workspace/add-project-card'

const DashboardHeader = () => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <header className="border-b-[1px] border-boder py-4 px-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-slate-800">
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0">
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                            <span>Filtered by</span>
                            <span className="text-white">Active Projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Sorted by</span>
                            <span className="text-white">Status</span>
                        </div>
                    </div>
                </div>

                {/* Search */}
                {/* <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search"
                        className="w-80 bg-slate-800 border-slate-700 pl-10 text-white placeholder:text-slate-400"
                    />
                </div> */}

                {/* New Project Button */}
                <AddProjectCard
                    open={open}
                    setOpen={setOpen}
                    triggerBtn={true}
                />
            </div>
        </header>
    )
}

export default DashboardHeader
