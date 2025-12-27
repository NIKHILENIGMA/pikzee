import { useState } from 'react'
import { Toaster } from 'sonner'

import { type ProjectView, useDefaultWorkspace, Header, FilterBar, WorkspaceProvider, ProjectGrid } from '@/features/workspace'

export default function DashboardPage() {
    const [view, setView] = useState<ProjectView>('GRID')
    const workspaceQuery = useDefaultWorkspace({
        queryConfig: {
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 15 * 60 * 1000 // 15 minutes
        }
    })

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <WorkspaceProvider workspace={workspaceQuery.data?.data ?? null}>
                <main className="flex-1">
                    <Header />
                    <div className="py-8">
                        <FilterBar
                            view={view}
                            onViewChange={setView}
                        />
                        {workspaceQuery.isPending ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">Loading workspace...</div>
                        ) : workspaceQuery.data ? (
                            <ProjectGrid view={view} />
                        ) : null}
                    </div>
                    <Toaster />
                </main>
            </WorkspaceProvider>
        </div>
    )
}
