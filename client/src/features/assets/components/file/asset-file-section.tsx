import { Loader2 } from 'lucide-react'
import type { FC } from 'react'

// import { Checkbox } from '@/components/ui/checkbox'

import AssetFile from './asset-file'
import type { Files } from '../../types/assets'
import { Card, CardContent } from '@/components/ui/card'

interface AssetFileSectionProps {
    items: Files[]
    progress: { [key: string]: number }
}

const AssetFileSection: FC<AssetFileSectionProps> = ({ items, progress }) => {
    return (
        <div>
            {/* {items.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/85">
                        <Checkbox className="data-[state=checked]:border-border data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-foreground" />
                        <File size={16} />
                    </div>
                </div>
            )} */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                    <AssetFile
                        key={item.id}
                        item={item}
                        selectedItems={new Set()}
                    />
                ))}
                {Object.entries(progress).map(([name, progressPercent]) => (
                    <div
                        key={name}
                        className="text-xs flex items-center gap-2">
                        {name} -{' '}
                        {progressPercent === -1 ? (
                            <span className="text-red-500">Failed</span>
                        ) : (
                            <Card className="w-full h-full bg-card border border-border">
                                <CardContent className="p-2 flex items-center gap-2">
                                    {progressPercent < 100 && progressPercent > -1 && <Loader2 className="animate-spin w-4 h-4 text-primary" />}
                                    <span>{progressPercent}%</span>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AssetFileSection
