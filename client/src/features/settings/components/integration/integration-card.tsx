import { FaYoutube } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface IntegrationCardProps {
    isConnected: boolean
    onConnect: () => void
    onDisconnect?: () => void
}

export default function IntegrationCard({ isConnected, onConnect, onDisconnect }: IntegrationCardProps) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border p-8 transition-all duration-300',
                'bg-gradient-to-br from-background/80 to-muted/40 backdrop-blur-sm',
                isConnected && 'ring-2 ring-primary/50 shadow-lg',
                'hover:shadow-2xl hover:shadow-primary/10'
            )}>
            {/* Hover overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
                {/* Header with icon and status */}
                <div className="flex items-start justify-between mb-6">
                    <div
                        className={cn(
                            'text-5xl p-3 rounded-full bg-gradient-to-br from-primary to-white transition-transform duration-300',
                            'group-hover:scale-110'
                        )}>
                        <FaYoutube
                            className="text-red-600 w-12 h-12"
                            size={40}
                        />
                    </div>

                    {isConnected ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-primary text-xs font-semibold">Connected</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-primary text-xs font-semibold">Not Connected</span>
                        </div>
                    )}
                </div>

                {/* Title and description */}
                <h3
                    className={cn(
                        'text-2xl font-bold text-foreground mb-2',
                        'group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-muted-foreground group-hover:bg-clip-text transition-all duration-300'
                    )}>
                    YouTube Integration
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-2">Connect your YouTube channel to manage content</p>

                {/* Button */}
                {isConnected ? (
                    <Button
                        onClick={onDisconnect}
                        className={cn(
                            'relative overflow-hidden px-5 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300',
                            'bg-primary text-primary-foreground hover:scale-105 active:scale-95'
                        )}>
                        <span className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        Disconnect
                    </Button>
                ) : (
                    <Button
                        onClick={onConnect}
                        className={cn(
                            'relative overflow-hidden px-5 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300',
                            'bg-primary text-primary-foreground hover:scale-105 active:scale-95'
                        )}>
                        <span className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        Connect
                    </Button>
                )}
            </div>
        </div>
    )
}
