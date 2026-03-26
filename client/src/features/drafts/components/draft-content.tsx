import { X } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router'

import { cn } from '@/shared/lib/utils'
import { EditorRoot } from '@/features/block/components/editor-root'
import { useWorkspaceContext } from '@/features/workspace'

import { useGetDraft } from '../api/get-draft'

import DraftContainer from './draft-container'
import { DraftCover } from './draft-cover'
import { DraftHeaderActions } from './draft-header-actions'
import DraftMeta from './draft-meta'
import DraftTitle from './draft-title'
import type { DraftDTO, DraftSettingType } from '../types/draft.types'
import { DraftSettings } from './draft-settings'
// import { useDraftStore } from '../store/draft.store'
import { useUpdateDraftContent } from '../api/update-content'
import { toast } from 'sonner'
// import { useDraftStore } from '../store/draft.store'

const DEFAULT_SETTINGS: DraftSettingType = {
    fontStyle: 'sans',
    fontSize: '25px',
    isFullWidth: false,
    showCover: true,
    showIcon: true,
    showOwner: true,
    showLastModified: true
}
const initialDraft: DraftDTO = {
    id: '',
    owner: {
        id: '',
        firstName: '',
        lastName: '',
        avatarUrl: null
    },
    title: null,
    docId: '',
    content: null,
    icon: null,
    coverImageUrl: null,
    coverImageConfig: null,
    settings: null,
    lastUpdatedBy: {
        id: '',
        firstName: '',
        lastName: '',
        avatarUrl: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
}

export default function DraftContent() {
    const { pageId, documentId } = useParams<{ documentId: string; pageId: string }>()

    const { id: workspaceId } = useWorkspaceContext()

    const { data: draftData, isLoading: draftLoading } = useGetDraft({
        workspaceId,
        docId: documentId!,
        draftId: pageId!
    })

    const [draftDetails, setDraftDetails] = useState<DraftDTO>(initialDraft)
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { mutateAsync: updateDraftContent } = useUpdateDraftContent({})


    const handleClearErrorMsg = () => {
        setError(null)
    }

    const handleSaveContent = async () => {
        try {
            await updateDraftContent({
                workspaceId,
                docId: documentId!,
                draftId: pageId!,
                title: draftDetails.title ?? '',
                content: draftDetails.content
            })
            toast.success('Draft content saved successfully!')
        } catch (err) {
            setError('Failed to save draft content.')
            toast.error('Failed to save draft content.')
        }
    }

    useEffect(() => {
        if (!draftData) return

        setDraftDetails(draftData)
    }, [draftData])

    // Merge default settings with draft settings
    const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...(draftData?.settings || {}) }), [draftData?.settings])

    if (draftLoading || (draftData && draftData.id !== pageId)) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Loading draft content...</p>
            </div>
        )
    }

    return (
        <DraftContainer settings={settings}>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center justify-between">
                    <p className="text-sm">{error}</p> <X onClick={handleClearErrorMsg} />
                </div>
            )}
            {/* Cover + Icon overlay */}
            <DraftCover settings={settings} draft={draftDetails} />

            <div
                className={cn(
                    'transition-[max-width,padding-left,padding-right] ease-in-out',
                    !!settings.isFullWidth ? 'px-8 max-w-full' : 'max-w-4xl mx-auto px-4',
                    settings.showIcon && draftData?.icon && 'pt-12'
                )}
                style={{
                    transition: 'max-width 0.3s ease, padding-left 0.3s ease, padding-right 0.3s ease'
                }}>
                {/* Controls */}
                <DraftHeaderActions
                    draft={draftDetails}
                    settings={settings}
                    onOpenSettings={() => setSettingsOpen(true)}
                    onDraftSave={handleSaveContent}
                />

                {/* Owner Details */}
                <DraftMeta settings={settings} />

                {/* Title */}
                <DraftTitle
                    settings={settings}
                    value={draftDetails.title ?? ''}
                    onChange={(title) => setDraftDetails((prev) => ({ ...prev, title }))}
                />

                {/* Editor */}
                <EditorRoot
                    key={draftData?.id}
                    value={draftDetails.content ?? ''}
                    onChange={(content) => setDraftDetails((prev) => ({ ...prev, content }))}
                />

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
