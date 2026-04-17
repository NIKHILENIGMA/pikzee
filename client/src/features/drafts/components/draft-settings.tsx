import { useParams } from 'react-router'
import { toast } from 'sonner'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useWorkspaceContext } from '@/features/workspace'

import { useUpdateDraftSettings } from '../api/update-settings'
import { fontSizeOptions, fontStyleOptions, pageWidthOptions, visibilityOptions } from '../constant'
import type { DraftSettingType, FontSize, FontStyle, PageWidth } from '../types/draft.types'

import SegmentGroup from './segment-group'
import { useStore } from '@/shared/store'

interface SettingsProps {
    settings: DraftSettingType
}

export function DraftSettings({ settings }: SettingsProps) {
    const { id: workspaceId } = useWorkspaceContext()
    const { documentId, pageId } = useParams<{ documentId: string; pageId: string }>()
    const isOpen = useStore((state) => state.isEditorSettingsOpen)
    const toggleEditorSettings = useStore((state) => state.toggleEditorSettings)

    const { mutateAsync: updateDraftSettings } = useUpdateDraftSettings({})

    if (!documentId || !pageId) {
        return null
    }

    /**
     * Handle update with optimistic UI update
     * 
     * @param values Partial settings to update
     */
    const handleUpdate = async (values: Partial<DraftSettingType>) => {
        try {
            await updateDraftSettings({
                workspaceId,
                docId: documentId,
                draftId: pageId,
                ...values
            })
        } catch (error) {
            toast.error('Failed to update settings')
        }
    }

    return (
        <Sheet
            open={isOpen}
            onOpenChange={toggleEditorSettings}>
            <SheetContent className="w-[350px]">
                <SheetHeader>
                    <SheetTitle>Page Settings</SheetTitle>
                    <SheetDescription>Customize how this page looks.</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-6 py-6 ">
                    {/* Typography Section */}
                    <div className="space-y-3 px-4.5">
                        <div className="w-full space-y-6 rounded-2xl">
                            <SegmentGroup<FontStyle>
                                title="Font style"
                                value={settings.fontStyle}
                                onChange={(val) => handleUpdate({ fontStyle: val })}
                                options={fontStyleOptions}
                            />

                            <SegmentGroup<FontSize>
                                title="Font size"
                                value={settings.fontSize}
                                onChange={(val) => handleUpdate({ fontSize: val })}
                                options={fontSizeOptions}
                            />

                            <SegmentGroup<PageWidth>
                                title="Page width"
                                value={settings.isFullWidth ? 'full' : 'default'}
                                onChange={(val) => handleUpdate({ isFullWidth: val === 'full' })}
                                options={pageWidthOptions}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Visibility Section */}
                    <div className="space-y-4 px-4.5">
                        <h4 className="text-sm font-medium text-foreground/80">Visibility</h4>
                        <div className="space-y-4">
                            {visibilityOptions.map((opt) => (
                                <div
                                    className="flex items-center justify-between space-x-2"
                                    key={opt.key}>
                                    <Label
                                        htmlFor={`show-${opt.key}`}
                                        className="text-sm font-normal flex items-center gap-2 cursor-pointer w-full">
                                        <span className="text-muted-foreground">{opt.icon}</span>
                                        {opt.label}
                                    </Label>
                                    <Switch
                                        id={`show-${opt.key}`}
                                        checked={!!settings[opt.key]}
                                        onCheckedChange={(val) => handleUpdate({ [opt.key]: val })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
