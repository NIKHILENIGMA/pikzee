import { Trash2, CheckCircle2 } from 'lucide-react'

import type { ConnectedAccount } from '@/app/routes/settings/integration-hub'

interface ConnectedAccountsProps {
    accounts: ConnectedAccount[]
    onDisconnect: (accountId: string, platform: string) => void
}

export default function ConnectedAccounts({ accounts, onDisconnect }: ConnectedAccountsProps) {
    const platformGradients: Record<string, string> = {
        youtube: 'from-red-600/20 to-red-500/10 border-red-500/30 hover:border-red-500/60',
        linkedin: 'from-blue-600/20 to-blue-500/10 border-blue-500/30 hover:border-blue-500/60',
        x: 'from-slate-600/20 to-slate-500/10 border-slate-500/30 hover:border-slate-500/60'
    }

    return (
        <div className="space-y-4">
            {accounts.map((account) => {
                const gradient = platformGradients.youtube
                return (
                    <div
                        key={account.channelId}
                        className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 bg-gradient-to-r ${gradient} backdrop-blur-sm hover:shadow-lg hover:shadow-slate-900/30`}>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={20}
                                            className="text-emerald-400"
                                        />
                                        <h3 className="text-lg font-bold text-white">{account.channelId}</h3>
                                    </div>
                                    <span className="text-slate-300 text-sm font-medium px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                                        {account.channelTitle}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    Connected on <span className="text-slate-300 font-medium">{account.connected}</span>
                                </p>
                            </div>

                            <button
                                onClick={() => onDisconnect(account.channelId, 'youtube')}
                                className="ml-4 p-2.5 text-slate-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
                                aria-label={`Disconnect ${account.channelTitle}`}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
