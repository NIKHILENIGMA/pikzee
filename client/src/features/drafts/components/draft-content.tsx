import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router'

// import { useWorkspaceContext } from '@/features/workspace'
import { cn } from '@/shared/lib/utils'

import { useDraftContext } from '../hooks/use-draft-context'
// import { useGetDraft } from '../api/get-draft'

import DraftContainer from './draft-container'
import { DraftCover } from './draft-cover'
import { DraftHeaderActions } from './draft-header-actions'
import DraftMeta from './draft-meta'
import DraftTitle from './draft-title'
// import { EditorRoot } from '@/features/block/components/editor-root'
import { mockDrafts } from '../constant'
import type { DraftDTO, DraftSettingType } from '../types/draft.types'
import { DraftSettings } from './draft-settings'
// import { toast } from 'sonner'
// import { useUpdateDraftVisual } from '../api/update-visual'

const DEFAULT_SETTINGS: DraftSettingType = {
    fontStyle: 'sans',
    fontSize: '25px',
    isFullWidth: false,
    showCover: true,
    showIcon: true,
    showOwner: true,
    showLastModified: true
}

export default function DraftContent() {
    // const { id: workspaceId } = useWorkspaceContext()
    const { draft, updateDraft } = useDraftContext()
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
    const { pageId } = useParams<{ documentId: string; pageId: string }>()

    function getDraftDataById(pageId: string): DraftDTO {
        const draftdetails = mockDrafts.find((draft) => draft.id === pageId)
        if (!draftdetails) {
            throw new Error('Draft not found')
        }

        return draftdetails
    }

    // const { data: draftData, isLoading } = useGetDraft({
    //     workspaceId,
    //     docId: documentId!,
    //     draftId: pageId!
    // })

    // const {
    //     mutateAsync: updateVisual,
    //     isPending: visualLoading,
    //     isError
    // } = useUpdateDraftVisual({
    //     workspaceId
    // })

    // const handleIconUpdate = async (icon: string) => {
    //     try {
    //         await updateVisual({
    //             workspaceId,
    //             docId: documentId!,
    //             draftId: pageId!,
    //             icon
    //         })

    //         toast.success('Icon updated successfully!')
    //     } catch (error) {
    //         toast.error(isError ? `${(error as Error)?.message}` : 'Failed to update icon')
    //     }
    // }

    // useEffect(() => {
    //     if (draftData && draft.id !== draftData.id && !isLoading) {
    //         updateDraft(draftData)
    //     }
    // }, [draft.id, draftData, isLoading, updateDraft])

    useEffect(() => {
        if (draft.id !== pageId) {
            // Optional: Add a check to prevent unnecessary updates
            updateDraft(getDraftDataById(pageId!))
        }
    }, [draft.id, pageId, updateDraft])

    // Merge default settings with draft settings
    const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...(draft.settings || {}) }), [draft.settings])

    // if (isLoading) {
    //     return (
    //         <div className="flex flex-col items-center justify-center h-full gap-4">
    //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    //             <p className="text-sm text-muted-foreground">Loading draft...</p>
    //         </div>
    //     )
    // }

    return (
        <DraftContainer settings={settings}>
            {/* Cover + Icon overlay */}
            <DraftCover
                draft={draft}
                settings={settings}
                // isIconLoading={visualLoading}
                // handleIconUpdate={handleIconUpdate}
            />

            <div
                className={cn(
                    'transition-[max-width,padding-left,padding-right] ease-in-out',
                    !!settings.isFullWidth ? 'px-8 max-w-full' : 'max-w-4xl mx-auto px-4',
                    settings.showIcon && draft.icon && 'pt-12'
                )}
                style={{
                    transition: 'max-width 0.3s ease, padding-left 0.3s ease, padding-right 0.3s ease',
                    
                }}>
                {/* Controls */}
                <DraftHeaderActions
                    draft={draft}
                    settings={settings}
                    onUpdateDraft={updateDraft}
                    onOpenSettings={() => setSettingsOpen(true)}
                />

                {/* Owner Details */}
                <DraftMeta
                    draft={draft}
                    settings={settings}
                />

                {/* Title */}
                <DraftTitle
                    draft={draft}
                    settings={settings}
                />

                {/* Editor */}
                {/* <EditorRoot /> */}

                {/* Settings Panel */}
                <DraftSettings
                    isOpen={settingsOpen}
                    onClose={() => setSettingsOpen(false)}
                    settings={settings}
                    
                />
            </div>
        </DraftContainer>
    )
}
