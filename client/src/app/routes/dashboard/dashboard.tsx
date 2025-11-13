import { type FC } from 'react'

import { WorkspaceContent, WorkspaceHeader } from '@/features/dashboard'
import { useCurrentUserWorkspace } from '@/features/dashboard/hooks/use-workspace-query'

const Dashboard: FC = () => {
    const { data: workspaceDetails, isPending } = useCurrentUserWorkspace()

    if (isPending) return <div>Loading...</div>
    // if (isError) return <div>Error loading workspace data.</div>
    // if (!workspaceDetails) return <div>No workspace data found.</div>

    // console.log('workspace: ', workspaceDetails[0].id);

    return (
        <div className="w-full h-full bg-background text-foreground">
            {/* Header */}
            <WorkspaceHeader />
            {/* Main Content */}
            <WorkspaceContent workspace={workspaceDetails} />
        </div>
    )
}

export default Dashboard
