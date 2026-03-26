import { Image, Loader, Save, Settings, SmilePlus } from 'lucide-react'
import { useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import type { DraftDTO, DraftSettingType } from '../types/draft.types'
import { useWorkspaceContext } from '@/features'

import { useHeaderActions } from '../hooks/use-header-actions'
// import { useDraftStore } from '../store/draft.store'

interface DraftHeaderActionsProps {
    draft: DraftDTO
    settings: DraftSettingType
    onOpenSettings: () => void
    onDraftSave: () => void
}

export function DraftHeaderActions({ draft, settings, onOpenSettings, onDraftSave }: DraftHeaderActionsProps) {
    const { id: workspaceId } = useWorkspaceContext()

    const { pageId, documentId } = useParams<{ pageId: string; documentId: string }>()

    const { addEmojiPending, createCoverImagePending, handleAddCoverImage, handleAddEmojiIcon } = useHeaderActions({
        workspaceId,
        pageId: pageId!,
        documentId: documentId!
    })

    return (
        <div className="flex items-center gap-2 mt-5 mb-3 py-4">
            {settings.showIcon && !draft.icon && (
                <Button
                    variant="ghost"
                    size="default"
                    onClick={handleAddEmojiIcon}
                    disabled={addEmojiPending}>
                    {addEmojiPending ? (
                        <>
                            <Loader className="h-5 w-5 animate-spin mr-2" />
                            Adding Icon...
                        </>
                    ) : (
                        <>
                            <SmilePlus className="h-5 w-5 mr-2" />
                            Add Icon
                        </>
                    )}
                </Button>
            )}
            {settings.showCover && !draft.coverImageUrl && (
                <Button
                    variant="ghost"
                    size="default"
                    onClick={handleAddCoverImage}
                    disabled={createCoverImagePending}>
                    {createCoverImagePending ? (
                        <>
                            <Loader className="h-5 w-5 animate-spin mr-2" />
                            Adding Cover...
                        </>
                    ) : (
                        <>
                            <Image className="h-5 w-5 mr-2" />
                            Add Cover
                        </>
                    )}
                </Button>
            )}
            <Button
                variant="ghost"
                size="default"
                onClick={onOpenSettings}
                disabled={addEmojiPending || createCoverImagePending}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
            </Button>
            <Button
                variant="ghost"
                size="default"
                onClick={onDraftSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
            </Button>

            {/* {isEditing === 'saving' && <span className="text-xs text-muted-foreground italic ml-2">Saving...</span>}
            {isEditing === 'saved' && <span className="text-xs text-muted-foreground italic ml-2">All changes saved</span>} */}
            {/* ✅ NEW: visible error state so user knows the save failed */}
            {/* {isEditing === 'error' && (
                <span className="text-xs text-red-500 italic ml-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Save failed — will retry
                </span>
            )} */}
        </div>
    )
}
