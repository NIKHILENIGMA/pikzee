import { useStore } from '@/shared/store'
import type { Tool } from './editor-toolbar'

interface ToolPanelProps {
    activeTool: Tool
}

type ToolAction = {
    label: string
    onClick: () => void
}

export function ToolPanel({ activeTool }: ToolPanelProps) {
    const addTransformation = useStore((state) => state.addTransformation)

    const actionButtonClass =
        'w-full rounded-md border border-border bg-background px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted'

    const actionsByTool: Record<Tool, { title: string; description: string; actions: ToolAction[] }> = {
        resize: {
            title: 'Resize Actions',
            description: 'Set common output dimensions quickly.',
            actions: [
                {
                    label: 'Resize 800x600',
                    onClick: () =>
                        addTransformation({
                            type: 'resize',
                            width: 800,
                            height: 600
                        })
                },
                {
                    label: 'Resize 1920x1080',
                    onClick: () =>
                        addTransformation({
                            type: 'resize',
                            width: 1920,
                            height: 1080
                        })
                }
            ]
        },
        crop: {
            title: 'Crop Actions',
            description: 'Apply a crop mode for framing.',
            actions: [
                {
                    label: 'Crop Maintain Ratio',
                    onClick: () =>
                        addTransformation({
                            type: 'crop',
                            mode: 'maintain_ratio'
                        })
                },
                {
                    label: 'Crop At Least',
                    onClick: () =>
                        addTransformation({
                            type: 'crop',
                            mode: 'at_least'
                        })
                }
            ]
        },
        effect: {
            title: 'Effect Actions',
            description: 'Apply visual filters to your image.',
            actions: [
                {
                    label: 'Grayscale',
                    onClick: () =>
                        addTransformation({
                            type: 'effect',
                            effect: 'grayscale'
                        })
                },
                {
                    label: 'Sharpen',
                    onClick: () =>
                        addTransformation({
                            type: 'effect',
                            effect: 'sharpen'
                        })
                }
            ]
        },
        background: {
            title: 'Background Actions',
            description: 'Handle removal or replacement options.',
            actions: [
                {
                    label: 'Remove Background',
                    onClick: () =>
                        addTransformation({
                            type: 'background',
                            action: 'remove'
                        })
                },
                {
                    label: 'Change To White',
                    onClick: () =>
                        addTransformation({
                            type: 'background',
                            action: 'change',
                            color: 'FFFFFF'
                        })
                }
            ]
        },
        overlay: {
            title: 'Overlay Actions',
            description: 'Add text or image overlays.',
            actions: [
                {
                    label: 'Add Watermark Text',
                    onClick: () =>
                        addTransformation({
                            type: 'overlay_text',
                            text: 'Pikzee'
                        })
                },
                {
                    label: 'Add Logo Overlay',
                    onClick: () =>
                        addTransformation({
                            type: 'overlay_image',
                            url: 'https://ik.imagekit.io/default/sample-logo.png'
                        })
                }
            ]
        },
        history: {
            title: 'History Actions',
            description: 'View and manage your edit history.',
            actions: []
        },
        export: {
            title: 'Export Actions',
            description: 'Export your edited image.',
            actions: []
        }
    }

    const currentConfig = actionsByTool[activeTool]

    return (
        <div className="w-96 border-l border-border/60 bg-card p-4">
            <div className="mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{currentConfig.title}</h3>
                <p className="mt-1 text-sm text-foreground">{currentConfig.description}</p>
            </div>

            {currentConfig.actions.map((action, index) => (
                action.label === 'Export' && currentConfig.actions.length === 1 ? null : (
                    <button
                        key={action.label}
                        onClick={action.onClick}
                        className={`${actionButtonClass} ${index > 0 ? 'mt-2' : ''}`}
                        type="button">
                        {action.label}
                    </button>
                )
            ))}
        </div>
    )
}
