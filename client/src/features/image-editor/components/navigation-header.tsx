import { Sliders, Sparkles, Layers, Wand2, Download } from 'lucide-react'

import type { EditorMode } from '@/app/routes/dashboard/magic-editor'
import { Button } from '@/components/ui/button'

interface NavigationHeaderProps {
    activeMode: EditorMode
    onModeChange: (mode: EditorMode) => void
}

const navigationItems = [
    {
        id: 'adjustments' as EditorMode,
        label: 'Adjustments',
        icon: Sliders,
        description: 'Basic image controls'
    },
    {
        id: 'ai-enhance' as EditorMode,
        label: 'AI Enhance',
        icon: Sparkles,
        description: 'AI-powered enhancements'
    },
    {
        id: 'overlays' as EditorMode,
        label: 'Overlays',
        icon: Layers,
        description: 'Add elements to image'
    },
    {
        id: 'ai-magic' as EditorMode,
        label: 'AI Magic',
        icon: Wand2,
        description: 'Advanced AI features'
    },
    {
        id: 'export' as EditorMode,
        label: 'Export',
        icon: Download,
        description: 'Download final image'
    }
]

export function NavigationHeader({ activeMode, onModeChange }: NavigationHeaderProps) {
    return (
        <header className="w-full bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                    <h1 className="text-xl font-semibold text-foreground mr-8">Image Editor</h1>

                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeMode === item.id

                        return (
                            <Button
                                key={item.id}
                                variant={isActive ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => onModeChange(item.id)}
                                className={`flex items-center space-x-2 px-4 py-2 transition-all ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}>
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">{item.label}</span>
                            </Button>
                        )
                    })}
                </div>

                <div className="text-sm text-muted-foreground">{navigationItems.find((item) => item.id === activeMode)?.description}</div>
            </div>
        </header>
    )
}
