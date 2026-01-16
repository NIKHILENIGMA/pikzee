import { Folder, File } from 'lucide-react'
import { type FC } from 'react'

import AssetFile from './asset-file'
import AssetFolder from './asset-folder'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import AssetGridContext from './asset-grid-context'

interface AssetGridProps {
    selectedItems: Set<string>
    setSelectedItems: (items: Set<string>) => void
    fileItems: {
        id: string
        name: string
        type: 'file' | 'folder'
        fileSize?: number
        items?: number
    }[]
}

const AssetGrid: FC<AssetGridProps> = ({ selectedItems, fileItems }) => {
    return (
        <AssetGridContext>
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-foreground/85">
                            <Checkbox className="data-[state=checked]:border-border data-[state=checked]:bg-primary data-[state=checked]:text-foreground dark:data-[state=checked]:border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-foreground" />
                            <Folder size={16} />
                            <span>
                                {fileItems.filter((f) => f.type === 'folder').length} Folders •{' '}
                                {(fileItems.filter((f) => f.type === 'folder').reduce((acc, curr) => acc + (curr.fileSize || 0), 0) / 1024).toFixed(
                                    1
                                )}{' '}
                                GB
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {fileItems
                            .filter((item) => item.type === 'folder')
                            .map((item) => (
                                <AssetFolder
                                    key={item.id}
                                    selected={selectedItems.has(item.id)}
                                    item={item}
                                />
                            ))}
                    </div>
                </div>
                {fileItems.filter((f) => f.type === 'file').length > 0 && <Separator className="my-4" />}
                <div>
                    {fileItems.filter((f) => f.type === 'file').length > 0 && (
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-foreground/85">
                                <Checkbox className="data-[state=checked]:border-border data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-foreground" />
                                <File size={16} />
                                <span>
                                    {fileItems.filter((f) => f.type === 'file').length} Assets •{' '}
                                    {(fileItems.filter((f) => f.type === 'file').reduce((acc, curr) => acc + (curr.fileSize || 0), 0) / 1024).toFixed(
                                        1
                                    )}{' '}
                                    GB{' '}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {fileItems
                            .filter((item) => item.type === 'file')
                            .map((item) => (
                                <AssetFile
                                    item={item}
                                    selectedItems={selectedItems}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </AssetGridContext>
    )
}

export default AssetGrid
