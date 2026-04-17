import { formatDate } from 'date-fns'
import { type FC } from 'react'

import type { DraftDTO, DraftSettingType } from '../types/draft.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// import { useDraftStore } from '../store/draft.store'

interface DraftMetaProps {
    draft: DraftDTO
    settings: DraftSettingType
}

const DraftMeta: FC<DraftMetaProps> = ({ draft, settings }) => {
    if (!settings.showOwner && !settings.showLastModified) {
        return null
    }

    return (
        <div className="flex items-center gap-3 mb-8 text-sm">
            {settings.showOwner && draft.owner && (
                <>
                    {draft.owner.avatarUrl !== null ? (
                        <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">Created By: </p>
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={draft.owner.avatarUrl} />
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                    {/* {draft.owner?.firstName.charAt(0)}
                                    {draft.owner?.lastName.charAt(0)} */}
                                </AvatarFallback>
                            </Avatar>
                            <span>
                                {draft.owner.firstName} {draft.owner.lastName}
                            </span>
                        </div>
                    ) : (
                        <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                {draft.owner.firstName.charAt(0)}
                                {draft.owner.lastName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </>
            )}
            {settings.showOwner && settings.showLastModified && <span className="text-sm text-gray-500">•</span>}

            {settings.showLastModified && draft.lastUpdatedBy && (
                <>
                    {draft.lastUpdatedBy.avatarUrl !== null ? (
                        <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">Last Updated By: </p>
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={draft.lastUpdatedBy.avatarUrl} />
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                    {/* {lastUpdatedBy?.firstName.charAt(0)}
                                        {lastUpdatedBy?.lastName.charAt(0)} */}
                                </AvatarFallback>
                                <span> at {formatDate(draft.updatedAt, 'HH:mm')}</span>
                            </Avatar>
                            <span className="ml-2">
                                {draft.lastUpdatedBy.firstName} {draft.lastUpdatedBy.lastName} at {formatDate(draft.updatedAt, 'HH:mm')}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                    {/* {lastUpdatedBy?.firstName.charAt(0)}
                                    {lastUpdatedBy?.lastName.charAt(0)} */}
                                </AvatarFallback>
                            </Avatar>
                            <span> at {formatDate(draft.updatedAt, 'HH:mm')}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default DraftMeta
