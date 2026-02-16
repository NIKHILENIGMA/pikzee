import { Checkbox } from '@radix-ui/react-checkbox'

import { type FC } from 'react'
import { useNavigate } from 'react-router'
import AssetContextOptions from '../asset-context-options'
import type { AssetContextType } from '../../types/assets'

interface AssetFileProps {
    item: AssetContextType
    selectedItems: Set<string>
}

const AssetFile: FC<AssetFileProps> = ({ item, selectedItems }) => {
    const navigate = useNavigate()
    return (
        <AssetContextOptions>
            <div
                key={item.id}
                onClick={() => navigate(`asset/${item.id}/preview`)}
                className={`bg-secondary rounded-lg overflow-hidden transition-colors cursor-pointer group relative ${
                    selectedItems.has(item.id) ? 'ring-2 ring-primary' : ''
                }`}>
                <div className="absolute top-2 left-2 z-10">
                    <Checkbox className="data-[state=checked]:border-border data-[state=checked]:bg-primary data-[state=checked]:text-foreground dark:data-[state=checked]:border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-foreground" />
                </div>
                <div className="aspect-square relative overflow-hidden flex items-center justify-center bg-slate-900">
                    {item.thumbnailPath ? (
                        <img
                            src={item.thumbnailPath}
                            alt={item.assetName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-white/65">No Preview</div>
                    )}
                    <span className="absolute top-2 right-2 bg-slate-900 text-white text-xs px-2 py-1 rounded">00:34</span>
                </div>
                <div className="p-3">
                    <p className="text-sm font-medium text-foreground truncate">{item.assetName}</p>
                    <p className="text-xs text-foreground/65 truncate">Nikhil Harmalkar • Sep 21</p>
                </div>
                <div className="px-3 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-foreground/65">Alpha</span>
                    </div>
                </div>
            </div>
        </AssetContextOptions>
    )
}

export default AssetFile
