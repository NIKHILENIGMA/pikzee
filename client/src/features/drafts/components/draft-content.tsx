import { useParams } from 'react-router'

import { useWorkspaceContext } from '@/features/workspace'
import { cn } from '@/shared/lib/utils'

import { useGetDraft } from '../api/get-draft'

import DraftContainer from './draft-container'
import { DraftCover } from './draft-cover'
import { DraftHeaderActions } from './draft-header-actions'
import DraftTitle from './draft-title'
import { DraftSettings } from './draft-settings'

import { DEFAULT_SETTINGS } from '../constant'
import DraftMeta from './draft-meta'
import { EditorRoot } from '@/features/block/components/editor-root'

export default function DraftContent() {
    const { pageId, documentId } = useParams<{ documentId: string; pageId: string }>()
    const { id: workspaceId } = useWorkspaceContext()
    if (!documentId || !pageId) {
        return <div className="flex items-center justify-center h-full">Invalid document or draft ID.</div>
    }

    // Fetch the draft data
    const { data: currentDraft, isLoading: draftLoading } = useGetDraft({
        workspaceId,
        docId: documentId,
        draftId: pageId
    })

    // Handle loading and error states
    if (draftLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Loading draft content...</p>
            </div>
        )
    }

    if (!currentDraft) {
        return <div className="flex items-center justify-center h-full">Draft not found.</div>
    }

    // Merge default settings with draft settings
    const settings = {
        ...DEFAULT_SETTINGS,
        ...(currentDraft.settings || {})
    }

    return (
        <DraftContainer>
            {/* Cover + Icon overlay */}
            <DraftCover
                settings={settings}
                draft={currentDraft}
            />

            <div
                className={cn(
                    'transition-[max-width,padding-left,padding-right] ease-in-out',
                    !!settings.isFullWidth ? 'px-8 max-w-full' : 'max-w-4xl mx-auto px-4',
                    settings.showIcon && currentDraft?.icon && 'pt-12'
                )}
                style={{
                    transition: 'max-width 0.3s ease, padding-left 0.3s ease, padding-right 0.3s ease'
                }}>
                {/* Controls */}
                <DraftHeaderActions
                    draft={currentDraft}
                    settings={settings}
                />

                {/* Owner Details */}
                <DraftMeta
                    draft={currentDraft}
                    settings={settings}
                />

                <div
                    style={{
                        fontFamily: `var(--font-${settings.fontStyle})`,
                        fontSize: settings.fontSize
                    }}>
                    {/* Title */}
                    <DraftTitle initialTitle={currentDraft.title} settings={settings} />

                    {/* Editor */}
                    <EditorRoot
                        key={currentDraft?.id}
                        value={currentDraft.content ?? ''}
                    />
                </div>

                {/* Settings Panel */}
                <DraftSettings settings={settings} />
            </div>
        </DraftContainer>
    )
}
