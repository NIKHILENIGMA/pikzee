import { Lock, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

export function FolderCard({ title, items, locked }: { title: string; items: number; locked?: boolean }) {
    return (
        <Card className="relative overflow-hidden rounded-lg border-border bg-muted/30 p-0">
            {/* Selection */}
            <div className="absolute left-2 top-2 z-10">
                <Checkbox aria-label={`Select ${title}`} />
            </div>

            {/* Simple "tab" effect */}
            <div className="absolute left-4 right-4 top-0 h-3 rounded-b-lg bg-background/30" />

            {/* Preview area */}
            <div className="h-36 w-full rounded-t-lg bg-muted/40" />

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 px-4 py-3">
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {locked ? <Lock className="size-4 text-muted-foreground" /> : null}
                        <span className="truncate">{title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {items} {items === 1 ? 'Item' : 'Items'}
                    </div>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="More">
                    <MoreHorizontal className="size-4" />
                </Button>
            </div>
        </Card>
    )
}
