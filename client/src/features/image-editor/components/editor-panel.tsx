import type { EditorMode } from '@/app/routes/dashboard/magic-editor'

import { AdjustmentsPanel } from './panels/adjustments-panel'
import { AIEnhancePanel } from './panels/ai-enhance-panel'
import { AIMagicPanel } from './panels/ai-magic-panel'
import { ExportPanel } from './panels/export-panel'
import { OverlaysPanel } from './panels/overlays-panel'

interface EditorPanelProps {
    activeMode: EditorMode
}

export function EditorPanel({ activeMode }: EditorPanelProps) {
    const renderPanel = () => {
        switch (activeMode) {
            case 'adjustments':
                return <AdjustmentsPanel />
            case 'ai-enhance':
                return <AIEnhancePanel />
            case 'overlays':
                return <OverlaysPanel />
            case 'ai-magic':
                return <AIMagicPanel />
            case 'export':
                return <ExportPanel />
            default:
                return <AdjustmentsPanel />
        }
    }

    return (
        <div className="h-full bg-card border-l border-border overflow-y-auto">
            <div className="p-6">{renderPanel()}</div>
        </div>
    )
}
