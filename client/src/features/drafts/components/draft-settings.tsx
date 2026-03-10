// components/editor/SettingsDrawer.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { DraftSettings } from '../types/draft.types'
import SegmentGroup from './segment-group'
import { Clock, Image, Smile, User } from 'lucide-react'

interface SettingsProps {
    isOpen: boolean
    onClose: () => void
    settings: DraftSettings
    onUpdate: (key: string, value: any) => void
}

interface VisibilityOption {
    label: string
    key: keyof DraftSettings
    icon: React.ReactNode
}

const visibilityOptions: VisibilityOption[] = [
    {
        label: 'Show Cover Image',
        key: 'showCover',
        icon: <Image />
    },
    {
        label: 'Show Page Icon',
        key: 'showIcon',
        icon: <Smile />
    },
    {
        label: 'Show Owner Name',
        key: 'showOwner',
        icon: <User />
    },
    {
        label: 'Show Last Updated Time',
        key: 'showLastModified',
        icon: <Clock />
    }
]

export function DraftSettings({ isOpen, onClose, settings, onUpdate }: SettingsProps) {
    const { fontStyle, fontSize, isFullWidth } = settings
    const setFontStyle = (val: string) => onUpdate('fontStyle', val)
    const setFontSize = (val: string) => onUpdate('fontSize', val)
    const setIsFullWidth = (val: boolean) => onUpdate('isFullWidth', val)
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
                            <SegmentGroup
                                title="Font style"
                                value={fontStyle}
                                onChange={setFontStyle}
                                options={[
                                    { label: 'System', value: 'system', icon: 'Aa' },
                                    { label: 'Serif', value: 'serif', icon: 'Ss' },
                                    { label: 'Mono', value: 'mono', icon: '00' }
                                ]}
                            />

                            <SegmentGroup
                                title="Font size"
                                value={fontSize}
                                onChange={setFontSize}
                                options={[
                                    { label: 'Small', value: 'small', icon: 'Aa≡' },
                                    { label: 'Default', value: 'default', icon: 'Aa≡' },
                                    { label: 'Large', value: 'large', icon: 'Aa≡' }
                                ]}
                            />

                            <SegmentGroup
                                title="Page width"
                                value={isFullWidth ? 'full' : 'default'}
                                onChange={(val) => setIsFullWidth(val === 'full')}
                                options={[
                                    { label: 'Default', value: 'default' },
                                    { label: 'Full width', value: 'full' }
                                ]}
                            />
                        </div>
                    </div>

                    {/* <Separator /> */}

                    {/* Layout Section */}
                    {/* <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase">Layout</h4>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="full-width">Full Width</Label>
                            <Switch
                                id="full-width"
                                checked={settings.isFullWidth}
                                onCheckedChange={(val) => onUpdate('isFullWidth', val)}
                            />
                        </div>
                    </div> */}

                    <Separator />

                    {/* Visibility Section */}
                    <div className="space-y-4 px-5">
                        <h4 className="text-sm font-normal text-foreground/80 ">Visibility</h4>
                        <>
                            {visibilityOptions.map((opt) => (
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="show-cover"
                                        className="text-sm">
                                        {' '}
                                        {opt.icon} {opt.label}{' '}
                                    </Label>
                                    <Switch
                                        id={`show-${opt.key}`}
                                        checked={Boolean(settings[opt.key])}
                                        onCheckedChange={(val) => onUpdate(opt.key, val)}
                                    />
                                </div>
                            ))}
                        </>
                        {/* <div className="flex items-center justify-between">
                            <Label htmlFor="show-owner">
                                {' '}
                                <Smile /> Show Icon{' '}
                            </Label>
                            <Switch
                                id="show-owner"
                                checked={settings.showIcon}
                                onCheckedChange={(val) => onUpdate('showIcon', val)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="show-owner">
                                {' '}
                                <User /> Owner Name
                            </Label>
                            <Switch
                                id="show-owner"
                                checked={settings.showOwner}
                                onCheckedChange={(val) => onUpdate('showOwner', val)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="show-owner">
                                {' '}
                                <Clock /> Last Updated
                            </Label>
                            <Switch
                                id="show-owner"
                                checked={settings.showLastModified}
                                onCheckedChange={(val) => onUpdate('showLastModified', val)}
                            />
                        </div> */}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
