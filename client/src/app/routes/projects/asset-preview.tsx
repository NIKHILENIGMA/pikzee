import { assets } from '@/shared/constants'
import { ChevronLeft, PanelRight } from 'lucide-react'
import { type FC } from 'react'
import { useNavigate, useParams } from 'react-router'

const AssetPreview: FC = () => {
    const params = useParams<{ assetId: string }>()
    const { assetId } = params
    const navigate = useNavigate()
    const asset = assets.find((a) => a.id === assetId)
    

    function fileType(assetName: string | undefined) {
        if (!assetName) return 'unknown'
        const extension = assetName.split('.').pop()?.toLowerCase()
        switch (extension) {
            case 'mp4':
            case 'mov':
            case 'avi':
                return 'video'
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'image'
            case 'mp3':
            case 'wav':
                return 'audio'
            default:
                return 'unknown'
        }
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <header className="w-full p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ChevronLeft className="cursor-pointer" onClick={() => navigate(-1)}/>
                    <h1 className="text-md font-semibold text-foreground">{asset?.name}</h1>
                </div>
                <button
                    onClick={() => {}}
                    className="p-1.5 hover: rounded transition-colors"
                    aria-label="Toggle Comment Sidebar">
                    <PanelRight
                        size={16}
                        className="cursor-pointer"
                    />
                </button>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                    {asset ? (
                        fileType(asset?.name) === 'video' ? (
                            <video
                                src={asset?.assetUrl}
                                controls
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : fileType(asset?.name) === 'image' ? (
                            <img
                                src={asset?.assetUrl}
                                alt={asset.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <p className="text-foreground">Asset not found.</p>
                        )
                    ) : (
                        <p className="text-foreground">Unsupported asset type.</p>
                    )}
                </div>
            </main>
        </div>
    )
}

export default AssetPreview
