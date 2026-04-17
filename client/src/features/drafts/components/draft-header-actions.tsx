import { Image, Loader, Settings, SmilePlus } from 'lucide-react'
import { useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import type { DraftDTO, DraftSettingType } from '../types/draft.types'
import { useWorkspaceContext } from '@/features'

import { useHeaderActions } from '../hooks/use-header-actions'
import { useStore } from '@/shared/store'

type Actions = {
    shouldRender: boolean
    onClick: () => void
    isPending: boolean
    idleLabel: string
    pendingLabel: string
    Icon: React.ComponentType<{ className?: string }>
}

interface DraftHeaderActionsProps {
    draft: DraftDTO
    settings: DraftSettingType
}

export function DraftHeaderActions({ draft, settings }: DraftHeaderActionsProps) {
    const { id: workspaceId } = useWorkspaceContext()
    const toggleEditorSettings = useStore((state) => state.toggleEditorSettings)
    const { pageId, documentId } = useParams<{ pageId: string; documentId: string }>()
    const hasRouteParams: boolean = Boolean(workspaceId && pageId && documentId)

    // Get the header action handlers and pending states from the custom hook
    const { addEmojiPending, createCoverImagePending, handleAddCoverImage, handleAddEmojiIcon } = useHeaderActions({
        workspaceId,
        pageId: pageId ?? '',
        documentId: documentId ?? ''
    })

    const mediaActionDisabled = addEmojiPending || createCoverImagePending || !hasRouteParams

    // Define the available actions based on the draft settings and current state
    const ACTIONS: Actions[] = [
        {
            shouldRender: settings.showIcon && !draft.icon,
            onClick: handleAddEmojiIcon,
            isPending: addEmojiPending,
            idleLabel: 'Add Icon',
            pendingLabel: 'Adding Icon...',
            Icon: SmilePlus
        },
        {
            shouldRender: settings.showCover && !draft.coverImageUrl,
            onClick: handleAddCoverImage,
            isPending: createCoverImagePending,
            idleLabel: 'Add Cover',
            pendingLabel: 'Adding Cover...',
            Icon: Image
        }
    ]

    return (
        <div className="flex items-center gap-2 mt-5 mb-3 py-4">
            {ACTIONS.map((action: Actions) => {
                if (!action.shouldRender) {
                    return null
                }

                const Icon = action.Icon

                return (
                    <Button
                        key={action.idleLabel}
                        variant="ghost"
                        size="default"
                        onClick={action.onClick}
                        disabled={mediaActionDisabled || action.isPending}
                        aria-busy={action.isPending}>
                        {action.isPending ? (
                            <>
                                <Loader className="h-5 w-5 animate-spin mr-2" />
                                {action.pendingLabel}
                            </>
                        ) : (
                            <>
                                <Icon className="h-5 w-5 mr-2" />
                                {action.idleLabel}
                            </>
                        )}
                    </Button>
                )
            })}
            <Button
                variant="ghost"
                size="default"
                onClick={toggleEditorSettings}
                disabled={addEmojiPending || createCoverImagePending}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
            </Button>
        </div>
    )
}
