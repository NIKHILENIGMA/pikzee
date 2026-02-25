import { Shell } from 'lucide-react'
import { useEffect, useState } from 'react'

import ContentHistory from '@/features/smart-publish/components/content-history'
import type { Account, HistoryItem } from '@/features/smart-publish/types/content'

import { useDefaultWorkspace } from '@/features/workspace/api/get-default-workspace'
import AccountSection from '@/features/smart-publish/components/account-section'
import { useAccounts } from '@/features/smart-publish/api/get-accounts'

const historyItems: HistoryItem[] = [
    {
        id: '1',
        title: 'How to use Pikzee',
        description: 'A quick guide to get started with Pikzee.',
        platform: 'YouTube',
        publishDate: '2026-02-10',
        thumbnail:
            'https://plus.unsplash.com/premium_photo-1661943659036-aa040d92ee64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGh1bWJuYWlsfGVufDB8fDB8fHww'
    },
    {
        id: '2',
        title: 'LinkedIn Growth Tips',
        description: 'Best practices for growing your LinkedIn audience.',
        platform: 'LinkedIn',
        publishDate: '2026-01-28',
        thumbnail:
            'https://plus.unsplash.com/premium_photo-1661943659036-aa040d92ee64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGh1bWJuYWlsfGVufDB8fDB8fHww'
    },
    {
        id: '3',
        title: 'Twitter Thread Mastery',
        description: 'How to write engaging Twitter threads.',
        platform: 'Twitter',
        publishDate: '2026-01-15',
        thumbnail:
            'https://plus.unsplash.com/premium_photo-1661943659036-aa040d92ee64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGh1bWJuYWlsfGVufDB8fDB8fHww'
    }
]

export default function MediaDashboard() {
    const [accounts, setAccounts] = useState<Account[]>([])
    // Fetch the default workspace to get the workspace ID
    const { data: workspaceResponse } = useDefaultWorkspace({})
    const workspaceId = workspaceResponse?.data?.id
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

    return (
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
                <AccountSection accounts={accounts} workspaceId={workspaceId!} />
                {/* Content History Section */}
                <ContentHistory historyItems={historyItems} />
            </main>
        </div>
    )
}
