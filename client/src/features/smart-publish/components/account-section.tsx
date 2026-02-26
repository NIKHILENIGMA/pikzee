import { Upload } from 'lucide-react'
import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import AccountCard from '@/features/smart-publish/components/account-card'
import { SUPPORTED_PLATFORMS } from '@/features/smart-publish/util/platform'

import type { Account } from '../types/content'
import { useConnectAccount } from '../api/connect-account'
import { toast } from 'sonner'
import { useDisconnectAccount } from '../api/disconnect-account'

interface AccountSectionProps {
    accounts: Account[]
    workspaceId: string
}

const AccountSection: FC<AccountSectionProps> = ({ accounts, workspaceId }) => {
    const navigate = useNavigate()
    const displayAccounts = SUPPORTED_PLATFORMS.map((platform) => {
        const connectedAccount = accounts?.find((acc) => acc.platform.toUpperCase() === platform)

        if (connectedAccount) {
            return connectedAccount
        }

        return {
            id: `${platform}-placeholder`,
            status: 'EXPIRED',
            platform,
            platformUserId: '',
            avatarUrl: null,
            coverUrl: null,
            accountName: platform.charAt(0) + platform.slice(1).toLowerCase(),
            createdAt: new Date()
        } as Account
    })

    // Handle connect account
    const { mutateAsync: connectAccount } = useConnectAccount({
        workspaceId,
        mutationConfig: {
            onSuccess: () => {
                toast.success('Account connected successfully!')
            }
        }
    })

    // Open the OAuth URL in a new tab for the user to connect their account
    const handleConnectAccount = async (platform: string) => {
        try {
            const response = await connectAccount(platform)
            sessionStorage.setItem('oauth_platform', platform)
            window.open(response, '_blank')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unknown error occurred while connecting the account.')
        }
    }

    // Handle disconnect account
    const { mutateAsync: disconnectAccount } = useDisconnectAccount({
        workspaceId,    
        mutationConfig: {
            onSuccess: () => {
                toast.success('Account disconnected successfully!')
            }
        }
    })

    // Call the disconnect account API and handle errors
    const handleDisconnectAccount = async (accountId: string, platform: string) => {
        try {
            await disconnectAccount({ accountId, platform })
        } catch (error) {
            toast.error('Failed to disconnect account')
        }
    }

    return (
        <section className="mb-16">
            <div className="mb-8 sm:flex items-center justify-between">
                <div className="flex flex-col mb-2 md:mb-0 space-y-0.5">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Connected Accounts</h2>
                    <p className="text-sm text-muted-foreground">Manage your social media connections</p>
                </div>
                <Button
                    className="gap-2"
                    size="sm"
                    onClick={() => navigate('upload')}>
                    <Upload className="h-4 w-4" />
                    Upload Content
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayAccounts.map((account) => (
                    <AccountCard
                        key={account.id}
                        account={account}
                        onConnect={handleConnectAccount}
                        onDisconnect={handleDisconnectAccount}
                    />
                ))}
            </div>
        </section>
    )
}

export default AccountSection
