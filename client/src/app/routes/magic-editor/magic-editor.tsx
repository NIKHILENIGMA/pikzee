import { useState, type FC } from 'react'

import { EditorPanel } from '@/features/image-editor/components/editor-panel'
import { LivePreview } from '@/features/image-editor/components/live-preview'
import { NavigationHeader } from '@/features/image-editor/components/navigation-header'

export type EditorMode = 'adjustments' | 'ai-enhance' | 'overlays' | 'ai-magic' | 'export'

const MagicEditor: FC = () => {
    const [activeMode, setActiveMode] = useState<EditorMode>('adjustments')
    const [previewImage, setPreviewImage] = useState<string>('/sample-image-for-editing.jpg')
    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Full-width navigation header */}
            <NavigationHeader
                activeMode={activeMode}
                onModeChange={setActiveMode}
            />

            {/* Main content area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Live Preview Area */}
                <div className="w-[65%] border-r border-border">
                    <LivePreview
                        image={previewImage}
                        onImageChange={setPreviewImage}
                    />
                </div>

                {/* Editor Options Panel */}
                <div className="w-[35%]">
                    <EditorPanel activeMode={activeMode} />
                </div>
            </div>
        </div>
    )
}

export default MagicEditor
