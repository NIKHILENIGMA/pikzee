'use client'
import { Aperture, Filter, ListFilter, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function ToolbarChips() {
    return (
        <div className="mx-auto flex max-w-[1600px] items-center gap-1 px-4 py-3">
            <Button
                variant="ghost"
                size="sm"
                className="gap-2">
                <Aperture className="size-4" />
                Appearance
            </Button>
            <Separator
                orientation="vertical"
                className="mx-1 h-6"
            />
            <Button
                variant="ghost"
                size="sm"
                className="gap-2">
                <ListFilter className="size-4" />
                Fields <span className="text-muted-foreground">7 Visible</span>
            </Button>
            <Separator
                orientation="vertical"
                className="mx-1 h-6"
            />
            <Button
                variant="ghost"
                size="sm"
                className="gap-2">
                <Filter className="size-4" />
                Sorted by <span className="text-muted-foreground">Custom</span>
            </Button>
            <Separator
                orientation="vertical"
                className="mx-1 h-6"
            />
            <Button
                variant="ghost"
                size="icon"
                aria-label="Add chip">
                <Plus className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                aria-label="More">
                <Plus className="size-4 rotate-45" />
            </Button>
        </div>
    )
}
