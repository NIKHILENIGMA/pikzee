import { useState } from 'react'

import { CanvasPreview } from '@/features/image-editor/components/canvas-preview'
import { EditorToolbar } from '@/features/image-editor/components/editor-toolbar'
import { EditorTopbar } from '@/features/image-editor/components/editor-topbar'
import { ToolPanel } from '@/features/image-editor/components/tool-panel'
import type { Tool } from '@/features/image-editor/components/editor-toolbar'
// import ImagesHistory from '@/features/image-editor/components/images-history'

export default function ImageEditor() {
    const [activeTool, setActiveTool] = useState<Tool>('resize')

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            <EditorTopbar />
            <div className="flex min-h-0 flex-1">
                <EditorToolbar
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                />
                <CanvasPreview />
                <ToolPanel activeTool={activeTool} />
            </div>
        </div>
    )
}
