import { Checkbox } from '@radix-ui/react-checkbox'

import { type FC } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import AssetContextOptions from '../asset-context-options'
import type { Files } from '../../types/assets'
import { File } from 'lucide-react'
import AssetProvider from '../../context/asset-context'

interface AssetFileProps {
    item: Files
    selectedItems: Set<string>
}

const AssetFile: FC<AssetFileProps> = ({ item, selectedItems }) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const folderId = searchParams.get('folderId')

    const handlePreview = () => {
        const previewUrl = folderId 
            ? `asset/${item.id}/preview?folderId=${folderId}`
            : `asset/${item.id}/preview`
        navigate(previewUrl)
    }

    return (
        <AssetProvider asset={item} type="FILE">
            <AssetContextOptions>
                <div
                    key={item.id}
                    onClick={handlePreview}
                    className={`bg-secondary rounded-lg overflow-hidden transition-all cursor-pointer group relative shadow-sm hover:shadow-md border border-transparent ${
                        selectedItems.has(item.id) ? 'ring-2 ring-primary border-primary shadow-md' : 'hover:border-primary/50'
                    }`}>
                    <div className="absolute top-3 left-3 z-10">
                        <Checkbox className="data-[state=checked]:border-border data-[state=checked]:bg-primary data-[state=checked]:text-foreground dark:data-[state=checked]:border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-foreground" />
                    </div>
                    <div className="aspect-square relative overflow-hidden flex items-center justify-center bg-slate-900 group-hover:bg-slate-800 transition-colors">
                        <File className="w-12 h-12 text-slate-400 group-hover:text-slate-300 transition-colors" />

                        {/* <span className="absolute top-2 right-2 bg-slate-900 text-white text-xs px-2 py-1 rounded">00:34</span> */}
                    </div>
                    <div className="p-3">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    </div>
                </div>
            </AssetContextOptions>
        </AssetProvider>
    )
}

export default AssetFile
