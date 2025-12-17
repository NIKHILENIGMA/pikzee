import { useUser } from '@clerk/clerk-react'
import { type FC } from 'react'

import { Tabs } from '@/components/ui/tabs'
import { useUserWorkspace } from '@/features/workspace/api/get-user-workspace'
import WorkspaceContent from '@/features/workspace/components/workspace-content'
import WorkspaceHeader from '@/features/workspace/components/workspace-header'

const DashboardPage: FC = () => {
    const workspaceQuery = useUserWorkspace({
        queryConfig: {
            gcTime: 5 * 60 * 1000, // 5 minutes
            staleTime: 4 * 60 * 1000 // 4 minutes
        }
    })
    const { user } = useUser()
    if (!user) {
        return <div>User not found.</div>
    }

    const workspace = workspaceQuery.data?.data

    if (workspaceQuery.isLoading) {
        return <div>Loading...</div>
    }

    if (workspaceQuery.isError || !workspace) {
        return <div>Error loading workspace.</div>
    }

    return (
        <Tabs defaultValue="grid">
            {/* Header */}
            <WorkspaceHeader />

            {/* Content */}
            <WorkspaceContent workspace={workspace} />
        </Tabs>
    )
}

export default DashboardPage
