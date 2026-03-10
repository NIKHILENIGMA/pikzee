import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { Button } from '@/components/ui/button'

import { mockDrafts } from '../constant'
import { useDraftContext } from '../hooks/use-draft-context'
import { DraftSettings } from './draft-settings'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Image, ScanFace, Settings } from 'lucide-react'

export default function DraftContent() {
    const { draft, updateDraft } = useDraftContext()
    const [settingsOpen, setSettingsOpen] = useState(false)
    const { pageId } = useParams<{ documentId: string; pageId: string }>()

    const data = mockDrafts.find((d) => d.id === pageId)

    useEffect(() => {
        if (!data) return

        updateDraft(data)
    }, [data])

    if (!data) return <div>Loading...</div>

    const settings = draft.settings || {
        fontStyle: 'mono',
        fontSize: '16px',
        isFullWidth: false,
        showCover: true,
        showOwner: true,
        showIcon: true,
        showLastModified: true
    }

    // Determine if icon is over the cover
    const iconOverCover = settings.showCover && draft.coverImageUrl && settings.showIcon && draft.icon;

    return (
        <div
            style={{
                fontFamily: settings.fontStyle,
                fontSize: settings.fontSize
            }}>
            {/* Cover + Icon overlay */}
            {settings.showCover && draft.coverImageUrl ? (
                <div
                    className="relative mb-6 h-52 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${draft.coverImageUrl})` }}>
                    {settings.showIcon && draft.icon && (
                        <div
                            className="absolute left-[15%] -bottom-10 z-10 flex items-center justify-center w-20 h-20 text-4xl"
                        >
                            {draft.icon}
                        </div>
                    )}
                </div>
            ) : null}

            <div
                className={`pb-2 ` + (settings.isFullWidth ? 'px-16' : 'max-w-4xl mx-auto') + (iconOverCover ? ' ml-[15%]' : '')}
            >
                {/* Controls */}
                <div className="flex gap-2 mt-5 mb-3">
                    {settings.showIcon && !draft.icon && (
                        <Button
                            variant="ghost"
                            onClick={() => updateDraft({ icon: '🚀' })}>
                            <ScanFace /> Add Icon
                        </Button>
                    )}

                    {settings.showCover && !draft.coverImageUrl && (
                        <Button
                            variant="ghost"
                            onClick={() =>
                                updateDraft({
                                    coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
                                })
                            }>
                            <Image />Add Cover
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        onClick={() => setSettingsOpen(true)}>
                        <Settings />Settings
                    </Button>
                </div>

                {/* Icon (if no cover) */}
                {(!settings.showCover || !draft.coverImageUrl) && settings.showIcon && draft.icon && (
                    <div
                        className="text-4xl mb-2"
                        style={{ fontFamily: settings.fontStyle }}>
                        {draft.icon}
                    </div>
                )}

                {(settings.showOwner || settings.showLastModified) && (
                    <div
                        className="flex items-center gap-3 mb-8"
                        style={{ fontFamily: settings.fontStyle }}>
                        {settings.showOwner && (
                            <>
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                                    <AvatarFallback className="bg-blue-600 text-white text-xs">AS</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-400">Abhay Sharma</span>
                            </>
                        )}
                        {settings.showOwner && settings.showLastModified && <span className="text-sm text-gray-500">•</span>}
                        {settings.showLastModified && <span className="text-sm text-gray-500">Last updated Today at 8:49 pm</span>}
                    </div>
                )}

                {/* Title */}
                <input
                    className="w-full text-4xl font-bold outline-none"
                    placeholder={'Untitled'}
                    value={draft.title !== null ? draft.title : ''}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                    style={{ fontFamily: settings.fontStyle, fontSize: settings.fontSize }}
                />

                {/* Editor Placeholder */}
                <div className="mt-6 min-h-[400px] text-muted-foreground">Start writing your content...</div>

                <DraftSettings
                    isOpen={settingsOpen}
                    onClose={() => setSettingsOpen(false)}
                    settings={settings}
                    onUpdate={(field, value) =>
                        updateDraft({
                            settings: {
                                fontStyle: draft.settings?.fontStyle ?? 'inter',
                                fontSize: draft.settings?.fontSize ?? '16px',
                                isFullWidth: draft.settings?.isFullWidth ?? false,
                                showCover: draft.settings?.showCover ?? true,
                                showOwner: draft.settings?.showOwner ?? true,
                                showIcon: draft.settings?.showIcon ?? true,
                                showLastModified: draft.settings?.showLastModified ?? true,
                                [field]: value
                            }
                        })
                    }
                />
            </div>
        </div>
    )
}
