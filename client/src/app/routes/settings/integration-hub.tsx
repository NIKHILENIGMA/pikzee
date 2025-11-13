import { useCallback, useEffect, useState } from 'react'
import { FaYoutube } from 'react-icons/fa'

import { disconnectIntegration, initiateOAuthFlow, integrationStatus } from '@/features/settings/apis/integrate-api'
import IntegrationCard from '@/features/settings/components/integration/integration-card'

export interface ConnectedAccount {
    connected: boolean
    channelTitle: string
    channelId: string
}

const IntegrationHub = () => {
    const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
    // const [disconnectModal, setDisconnectModal] = useState<{
    //     isOpen: boolean
    //     accountId: string | null
    //     platform: string | null
    // }>({
    //     isOpen: false,
    //     accountId: null,
    //     platform: null
    // })
    const [error, setError] = useState<string | null>(null)

    const checkStatus = useCallback(async () => {
        try {
            const result = await integrationStatus()
            setConnectedAccounts(result.connected ? [result] : [])
            setError(null)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Status check failed')
        }
    }, [])

    const connectYoutube = useCallback(async () => {
        try {
            const result = await initiateOAuthFlow()
            window.location.href = result.url
            setError(null)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to connect YouTube')
        }
    }, [])

    const handleDisconnect = useCallback(async () => {
        // Implement disconnect logic here
        try {
            await disconnectIntegration()
            await checkStatus()
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to disconnect integration')
        }
        // After disconnecting, refresh the connected accounts
    }, [checkStatus])

    useEffect(() => {
        // Fetch connected accounts from API
        checkStatus()
    }, [checkStatus])

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-background via-background/80 to-accent/60 p-6 md:p-12 text-foreground">
            <div className="max-w-6xl mx-auto">
                {error && <div className="mb-6 p-4 bg-red-100 text-red-800 border border-red-200 rounded">{error}</div>}
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">Integration Hub</h1>
                    <p className="text-foreground/60 text-lg">Connect your social media accounts to unlock powerful features</p>
                </div>

                {/* Connected Accounts Section */}

                {!!connectedAccounts.length && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6">Connected Accounts</h2>
                        {connectedAccounts.map((account) => (
                            <div
                                key={account.channelId}
                                className="mb-4 p-4 rounded-lg border border-red-200 bg-red-50/10">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 p-2 rounded-full bg-red-600/10">
                                        <FaYoutube
                                            size={40}
                                            className="text-red-600 w-12 h-12"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-foreground">Channel: {account.channelTitle}</h3>
                                        <p className="text-sm text-foreground/70 mt-1">
                                            <span className="font-mono">Channel ID: {account.channelId}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Available Integrations Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Available Integrations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <IntegrationCard
                            key={'youtube'}
                            isConnected={connectedAccounts.some((account) => account.channelId && account.channelTitle)}
                            onConnect={connectYoutube}
                            onDisconnect={handleDisconnect}
                        />
                    </div>
                </div>
            </div>

            {/* Disconnect Modal */}
            {/* <DisconnectModal
                isOpen={disconnectModal.isOpen}
                platform={disconnectModal.platform}
                onConfirm={() => {
                    if (disconnectModal.accountId) {
                        handleDisconnect(disconnectModal.accountId)
                    }
                }}
                onCancel={() => setDisconnectModal({ isOpen: false })}
            /> */}
        </div>
    )
}

export default IntegrationHub
