import { ChevronLeft, PanelRight, Loader2 } from 'lucide-react'
import { type FC } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import { useContent } from '@/features/assets/api/get-content'

const AssetPreview: FC = () => {
    const { projectId, assetId } = useParams<{ projectId: string; assetId: string }>()
    const [searchParams] = useSearchParams()
    const folderId = searchParams.get('folderId')
    const navigate = useNavigate()

    const { data: folderContent, isPending } = useContent({
        projectId: projectId || '',
        folderId: folderId || null
    })

    const asset = folderContent?.assets.find((a) => a.id === assetId)

    function fileType(mimeType: string | undefined) {
        if (!mimeType) return 'unknown'
        if (mimeType.startsWith('video/')) return 'video'
        if (mimeType.startsWith('image/')) return 'image'
        if (mimeType.startsWith('audio/')) return 'audio'
        return 'unknown'
    }

    if (isPending) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex flex-col bg-background text-foreground">
            <header className="w-full p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ChevronLeft className="cursor-pointer" onClick={() => navigate(-1)}/>
                    <h1 className="text-md font-semibold text-foreground truncate max-w-xs">{asset?.name}</h1>
                </div>
                <button
                    onClick={() => {}}
                    className="p-1.5 hover:bg-secondary rounded transition-colors"
                    aria-label="Toggle Comment Sidebar">
                    <PanelRight
                        size={16}
                        className="cursor-pointer"
                    />
                </button>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-secondary/30 rounded-lg flex items-center justify-center overflow-hidden border border-border">
                    {asset ? (
                        fileType(asset.mimeType) === 'video' ? (
                            <video
                                src={asset.assetUrl}
                                controls
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : fileType(asset.mimeType) === 'image' ? (
                            <img
                                src={asset.assetUrl}
                                alt={asset.name}
                                className="max-w-full max-h-full object-contain shadow-lg"
                            />
                        ) : fileType(asset.mimeType) === 'audio' ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-4xl">🎵</span>
                                </div>
                                <audio src={asset.assetUrl} controls className="w-80" />
                                <p className="text-sm font-medium">{asset.name}</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-foreground font-medium mb-2">Preview not available for this file type.</p>
                                <p className="text-muted-foreground text-sm">{asset.mimeType}</p>
                                <a 
                                    href={asset.assetUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                                >
                                    Download File
                                </a>
                            </div>
                        )
                    ) : (
                        <div className="text-center">
                            <p className="text-destructive font-semibold">Asset not found.</p>
                            <p className="text-muted-foreground text-sm">We couldn't locate the file you're looking for.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default AssetPreview
