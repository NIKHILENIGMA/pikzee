import { Shell } from 'lucide-react'
import { useEffect, useState } from 'react'

import ContentHistory from '@/features/smart-publish/components/content-history'
import { WorkspaceProvider } from '@/features/workspace'
import type { Account } from '@/features/smart-publish/types/content'

import { useDefaultWorkspace } from '@/features/workspace/api/get-default-workspace'
import AccountSection from '@/features/smart-publish/components/account-section'
import { useAccounts } from '@/features/smart-publish/api/get-accounts'

export default function MediaDashboard() {

    const [accounts, setAccounts] = useState<Account[]>([])
    // Fetch the default workspace to get the workspace ID
    const { data: workspaceResponse, isLoading: isLoadingWorkspace } = useDefaultWorkspace({})
    const workspace = workspaceResponse?.data
    const workspaceId = workspace?.id

    // Fetch accounts using the custom hook
    const { data: accountsData } = useAccounts({
        workspaceId: workspaceId!,
        queryConfig: {
            enabled: !!workspaceId
        }
    })

    useEffect(() => {
        if (accountsData) {
            setAccounts(accountsData)
        }
    }, [accountsData])

    if (isLoadingWorkspace) {
        return (
            <div className="w-full min-h-screen bg-background text-foreground flex items-center justify-center">
                <p className="text-muted-foreground animate-pulse">Loading Workspace...</p>
            </div>
        )
    }

    return (
        <WorkspaceProvider workspace={workspace ?? null}>
            <div className="w-full min-h-screen bg-background text-foreground">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b border-border ">
                    <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                <Shell className="mr-1 inline-block h-8 w-8" /> Media Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">Manage all your social media accounts in one place</p>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6 py-12">
                    {/* Connected Accounts Section */}
                    <AccountSection accounts={accounts} />
                    {/* Content History Section */}
                    <ContentHistory />
                </main>
            </div>
        </WorkspaceProvider>
    )
}
