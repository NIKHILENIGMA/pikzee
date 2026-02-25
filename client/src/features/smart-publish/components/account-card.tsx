import { Plug, Unplug } from 'lucide-react'
import type { FC } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import type { Account } from '../types/content'
import { PLATFORM_CONFIG } from '../util/platform'
import DisconnectPlatform from './disconnect-platform'

interface AccountCardProps {
    account: Account
    onConnect: (platform: string) => void
    onDisconnect: (accountId: string, platform: string) => void
}

const AccountCard: FC<AccountCardProps> = ({ account, onConnect, onDisconnect }) => {
    const config = PLATFORM_CONFIG[account.platform.toLowerCase()]
    const Icon = config?.icon || Plug

    if (account.status !== 'CONNECTED') {
        return (
            <Card className="group p-0 overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div
                    className="h-full flex flex-col justify-evenly items-center py-3 p-6 transition-colors duration-300"
                    style={
                        config
                            ? {
                                  backgroundColor: 'transparent'
                              }
                            : undefined
                    }
                    onMouseEnter={(e) => {
                        if (config) e.currentTarget.style.backgroundColor = config.color
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                    }}>
                    <div className="mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center transition-colors duration-300 group-hover:bg-white/20">
                        <Icon className="h-8 w-8 text-muted-foreground group-hover:text-white transition-colors" />
                    </div>

                    <div className="flex flex-col items-center text-center space-y-1">
                        <h3 className="font-semibold text-xl group-hover:text-white transition-colors">{account.platform} Not Connected</h3>

                        <p className="text-sm text-muted-foreground text-center group-hover:text-white/90 transition-colors">
                            Connect your {account.platform} account to start publishing content directly from Pikzee.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        className={`w-full mt-6 group-hover:bg-white group-hover:dark:text-white transition-colors`}
                        onClick={() => onConnect(account.platform)}>
                        <Plug className="mr-2 h-4 w-4" /> Connect Account
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="group overflow-hidden p-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-full relative">
                {account.coverUrl ? (
                    <img
                        src={account.coverUrl}
                        className="w-full h-24 object-cover"
                    />
                ) : (
                    <div className={`h-24 bg-gradient-to-r ${config?.gradient}`} />
                )}
                <Icon
                    className="absolute bottom-[-25%] right-5 w-11 h-11 border p-2 rounded-full bg-white"
                    style={{ color: config?.color, border: `1px solid ${config?.color}` }}
                />
            </div>
            <div className="py-3.5 px-4">
                <div className="flex justify-start space-x-2 items-start">
                    <div className="h-full flex items-center justify-center">
                        {account.avatarUrl ? (
                            <img
                                src={account.avatarUrl}
                                className="h-14 w-14 rounded-full border-2 border-white"
                            />
                        ) : (
                            <div className="h-14 w-14 flex justify-center items-center rounded-full bg-secondary border-2 border-border">
                                {account.accountName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="px-2">
                        <h3 className="font-semibold">Name: {account.accountName}</h3>
                        <p className="text-sm text-muted-foreground">ID: @{account.platformUserId}</p>
                        <p className="text-sm text-muted-foreground">Connected: {new Date(account.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <DisconnectPlatform
                    title={`Are you sure you want to disconnect your ${account.platform.toLowerCase().charAt(0).toUpperCase() + account.platform.toLowerCase().slice(1)} account?`}
                    description="Disconnecting your account will revoke Pikzee's access to it. You can reconnect it anytime by going through the authentication process again."
                    onConfirm={() => onDisconnect(account.id, account.platform)}>
                    <Button
                        variant="outline"
                        className="w-full mt-4">
                        <Unplug className="mr-2 h-4 w-4" />
                        Disconnect
                    </Button>
                </DisconnectPlatform>
            </div>
        </Card>
    )
}

export default AccountCard
