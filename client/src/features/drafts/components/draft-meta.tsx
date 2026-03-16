import type { FC } from 'react'
import type { DraftDTO, DraftSettingType } from '../types/draft.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DraftMetaProps {
    draft?: DraftDTO
    settings: DraftSettingType
}

const DraftMeta: FC<DraftMetaProps> = ({ settings }) => {
    if (!settings.showOwner || !settings.showLastModified) {
        return null
    }
    return (
        <>
            <div className="flex items-center gap-3 mb-8">
                {settings.showOwner && (
                    <>
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg?height=24&width=24" />
                            <AvatarFallback className="bg-blue-600 text-white text-xs">AS</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-400">Created by: Abhay Sharma</span>
                    </>
                )}
                {settings.showOwner && settings.showLastModified && <span className="text-sm text-gray-500">•</span>}

                {settings.showLastModified && <span className="text-sm text-gray-500">Last updated Today at 8:49 pm</span>}
                {
                    
                }
            </div>
        </>
    )
}

export default DraftMeta
