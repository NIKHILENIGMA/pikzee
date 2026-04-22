import { useStore } from '@/shared/store'

import type { Tool } from './editor-toolbar'
import ResizePanel from './panels/resize-panel'
import { CropPanel } from './panels/crop-panel'
import { TextOverlayPanel } from './panels/text-overlay-panel'
import { AITransformPanel } from './panels/ai-transformation-panel'
import { useTransformUrl } from '../hook/useTransformUrl'

interface ToolPanelProps {
    activeTool: Tool
    transform?: ReturnType<typeof useTransformUrl>
}

export function ToolPanel({ activeTool, transform: propTransform }: ToolPanelProps) {
    const activeTab = activeTool || 'resize'
    const originalPath = useStore((s) => s.originalPath)
    const hookTransform = useTransformUrl(originalPath)

    const transform = propTransform ?? hookTransform
    const { state, updateResize, updateCrop, updateTextOverlay, updateAI } = transform

    return (
        <div className="w-96 border-l border-border/60 bg-card p-6 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'resize' && (
                    <ResizePanel
                        resize={state.resize}
                        onChange={updateResize}
                    />
                )}
                {activeTab === 'crop' && (
                    <CropPanel
                        crop={state.crop}
                        onChange={updateCrop}
                    />
                )}
                {activeTab === 'overlay' && (
                    <TextOverlayPanel
                        textOverlay={state.textOverlay}
                        onUpdate={updateTextOverlay}
                        onRemove={() => updateTextOverlay(null)}
                    />
                )}
                {activeTab === 'background' && (
                    <AITransformPanel
                        ai={state.ai}
                        onChange={updateAI}
                    />
                )}
            </div>
        </div>
    )
}
