// components/editor/SettingsDrawer.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { DraftSettingType, FontSize, FontStyle, PageWidth } from '../types/draft.types'
import SegmentGroup from './segment-group'
import { useDraftContext } from '../hooks/use-draft-context'
import { fontSizeOptions, fontStyleOptions, pageWidthOptions, visibilityOptions } from '../constant'

interface SettingsProps {
    isOpen: boolean
    onClose: () => void
    settings: DraftSettingType
    // onUpdate: (key: string, value: boolean) => void
}

export function DraftSettings({ isOpen, onClose, settings }: SettingsProps) {
    const { fontStyle, fontSize, isFullWidth } = settings
    const { updateDraft } = useDraftContext()

    const onChangeView = (key: keyof DraftSettingType, value: FontStyle | FontSize | boolean) => {
        updateDraft({ settings: { ...settings, [key]: value } })
    }

    const onChangeVisibility = (key: keyof DraftSettingType, value: boolean) => {
        updateDraft({ settings: { ...settings, [key]: value } })
    }

    return (
        <Sheet
            open={isOpen}
            onOpenChange={onClose}>
            <SheetContent className="w-[350px]">
                <SheetHeader>
                    <SheetTitle>Page Settings</SheetTitle>
                    <SheetDescription>Customize how this page looks.</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-6 py-1">
                    {/* Typography Section */}
                    <div className="space-y-3">
                        <div className="w-full space-y-6 rounded-2xl px-5">
                            <SegmentGroup<FontStyle>
                                title="Font style"
                                value={fontStyle}
                                onChange={(val: FontStyle) => onChangeView('fontStyle', val)}
                                options={fontStyleOptions}
                            />

                            <SegmentGroup<FontSize>
                                title="Font size"
                                value={fontSize}
                                onChange={(val: FontSize) => onChangeView('fontSize', val)}
                                options={fontSizeOptions}
                            />

                            <SegmentGroup<PageWidth>
                                title="Page width"
                                value={isFullWidth ? 'full' : 'default'}
                                onChange={(val: PageWidth) => onChangeView('isFullWidth', val === 'full')}
                                options={pageWidthOptions}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Visibility Section */}
                    <div className="space-y-4 px-5">
                        <h4 className="text-sm font-normal text-foreground/80 ">Visibility</h4>
                        <>
                            {visibilityOptions.map((opt) => (
                                <div
                                    className="flex items-center justify-between space-x-2.5"
                                    key={opt.key}>
                                    <Label
                                        htmlFor="show-cover"
                                        className="text-sm font-normal text-start p-0.5 w-full">
                                        {' '}
                                        {opt.icon} {opt.label}{' '}
                                    </Label>
                                    <Switch
                                        id={`show-${opt.key}`}
                                        checked={Boolean(settings[opt.key])}
                                        onCheckedChange={(val: boolean) => onChangeVisibility(opt.key, val)}
                                    />
                                </div>
                            ))}
                        </>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
