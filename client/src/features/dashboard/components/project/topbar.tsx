import { LayoutGrid, SquareDashedBottomCode, Share2, Search, Users } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Topbar() {
    return (
        <header className="h-14 border-b border-border bg-secondary/40 backdrop-blur supports-[backdrop-filter]:bg-secondary/50">
            <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-4">
                <Avatar className="size-6">
                    <AvatarFallback className="text-[10px]">YV</AvatarFallback>
                </Avatar>
                <div className="mr-2 font-medium">Youtube Video</div>

                <div className="relative ml-auto w-full max-w-[420px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search"
                        className="pl-9 pr-3 bg-muted/40 border-border"
                        aria-label="Search"
                    />
                </div>

                <div className="ml-2 hidden items-center gap-1 sm:flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Collaborators">
                        <Users className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Layout presets">
                        <LayoutGrid className="size-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm">
                        <Share2 className="mr-2 size-4" />
                        Share
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Dev tools">
                        <SquareDashedBottomCode className="size-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
