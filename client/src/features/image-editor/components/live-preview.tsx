import { Upload, ZoomIn, ZoomOut, RotateCcw, Grid, Eye } from 'lucide-react'
import { useState, useRef } from 'react'

import { Button } from '@/components/ui/button'

interface LivePreviewProps {
    image: string
    onImageChange: (image: string) => void
}

export function LivePreview({ image, onImageChange }: LivePreviewProps) {
    const [zoom, setZoom] = useState(100)
    const [showGrid, setShowGrid] = useState(false)
    const [previewMode, setPreviewMode] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    onImageChange(e.target.result as string)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25))
    const handleResetZoom = () => setZoom(100)

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Preview toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    <Button
                        variant={showGrid ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setShowGrid(!showGrid)}>
                        <Grid className="w-4 h-4" />
                    </Button>

                    <Button
                        variant={previewMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}>
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleZoomOut}>
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground min-w-[60px] text-center">{zoom}%</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleZoomIn}>
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetZoom}>
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Preview area */}
            <div className="flex-1 flex items-center justify-center p-8 bg-muted/20 relative overflow-hidden">
                {/* Grid overlay */}
                {showGrid && (
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: `
                linear-gradient(to right, rgb(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(var(--border)) 1px, transparent 1px)
              `,
                            backgroundSize: '20px 20px'
                        }}
                    />
                )}

                <div
                    className="relative bg-white rounded-lg shadow-2xl overflow-hidden transition-transform duration-200"
                    style={{ transform: `scale(${zoom / 100})` }}>
                    <img
                        src={image || '/placeholder.svg?height=400&width=600&text=Upload+an+image+to+get+started'}
                        alt="Preview"
                        className="max-w-full max-h-[600px] object-contain"
                        style={{ minWidth: '400px', minHeight: '300px' }}
                    />

                    {/* Real-time effects overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* This is where real-time effects would be applied */}
                        {previewMode && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                <div className="bg-background/90 px-3 py-1 rounded text-sm font-medium">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled>
                                        Preview Mode
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status bar */}
            <div className="px-4 py-2 border-t border-border bg-card text-sm text-muted-foreground flex items-center justify-between">
                <span>Ready • Click Upload Image to get started</span>
                <span className="text-xs">{image !== '/placeholder.svg?key=h8din' ? 'Image loaded' : 'No image'}</span>
            </div>
        </div>
    )
}
