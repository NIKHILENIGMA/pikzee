import { Outlet } from 'react-router'

import { useDefaultWorkspace, WorkspaceProvider } from '@/features'

import DraftSidebar from '../../features/drafts/components/draft-sidebar'

export default function DraftLayout() {
    const workspaceResponse = useDefaultWorkspace({
        queryConfig: {
            staleTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 15 * 60 * 1000 // 15 minutes
        }
    })

    // Optional: handle loading and error states
    if (workspaceResponse.isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading workspace...</div>
    }
    if (workspaceResponse.isError) {
        return <div className="flex items-center justify-center h-screen text-red-500">Failed to load workspace.</div>
    }

    return (
        <WorkspaceProvider workspace={workspaceResponse.data?.data ?? null}>
            <div className="flex h-screen w-full">
                <DraftSidebar />
                <main className="flex-1 overflow-y-auto p-2">
                    <Outlet />
                </main>
            </div>
        </WorkspaceProvider>
    )
}
