import { useMemo, useState } from 'react'
import { Toaster } from 'sonner'

import { Loader } from '@/components'
import {
    type ProjectView,
    useDefaultWorkspace,
    Header,
    FilterBar,
    WorkspaceProvider,
    ProjectGrid,
    type Filters,
    type ProjectDTO
} from '@/features/workspace'

export default function DashboardPage() {
    const [view, setView] = useState<ProjectView>('GRID')
    const [filters, setFilters] = useState<Filters>({
        status: 'all',
        sortOrder: 'asc'
    })

    const workspaceQuery = useDefaultWorkspace({
        queryConfig: {
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 15 * 60 * 1000 // 15 minutes
        }
    })

    const sortFunction = (pro: ProjectDTO[], order: 'asc' | 'desc') => {
        const sortedProjects = [...pro].sort((a, b) => {
            const nameA = a.projectName.toLowerCase()
            const nameB = b.projectName.toLowerCase()

            if (order === 'asc') {
                return nameA.localeCompare(nameB)
            } else {
                return nameB.localeCompare(nameA)
            }
        })
        return sortedProjects
    }

    const filteredProjects = useMemo(() => {
        const projects = workspaceQuery.data?.data?.projects || []

        // Filter 
        const filtered = projects.filter((project) => {
            // Filter by status
            return filters.status === 'all' || project.status.toLowerCase() === filters.status
        })

        // Sort 
        return sortFunction(filtered, filters.sortOrder)
    }, [filters, workspaceQuery.data])


    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <WorkspaceProvider workspace={workspaceQuery.data?.data ?? null}>
                <main className="flex-1">
                    <Header />
                    <div className="py-3">
                        <FilterBar
                            view={view}
                            onViewChange={setView}
                            filters={filters}
                            onFiltersChange={setFilters}
                        />
                        {workspaceQuery.isPending ? (
                            <div className="fixed inset-0 flex items-center justify-center">
                                <Loader size="xl" />
                            </div>
                        ) : workspaceQuery.data ? (
                            <ProjectGrid
                                view={view}
                                projects={filteredProjects}
                            />
                        ) : null}
                    </div>
                    <Toaster />
                </main>
            </WorkspaceProvider>
        </div>
    )
}
