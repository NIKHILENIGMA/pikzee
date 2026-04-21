import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/shared/lib/utils'
import { useStore } from '@/shared/store'
import { Search } from 'lucide-react'
import type { FC } from 'react'

const IMAGES = [
    {
        id: '1',
        name: 'Sample Image 1',
        url: 'https://unsplash.it/600/400?image=10'
    },
    {
        id: '2',
        name: 'Sample Image 2',
        url: 'https://unsplash.it/600/400?image=20'
    },
    {
        id: '3',
        name: 'Sample Image 3',
        url: 'https://unsplash.it/600/400?image=30'
    }
]

const ImagesHistory: FC = () => {
    const isHistoryOpen = useStore((state) => state.isImageSidebarOpen)
    return (
        <div className={cn('border-r border-border/60 bg-card/60 p-4 overflow-y-scroll overflow-x-hidden', isHistoryOpen ? 'block' : 'hidden')}>
            <h3 className="text-md font-semibold uppercase tracking-wide text-muted-foreground">
              Your Images
            </h3>
            <p className="mt-1 text-sm text-foreground">
              View and manage all your uploaded images in one place.
            </p>
            <div className="mt-4 relative">
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'/>
                <Input placeholder="Search your assets" className='pl-8' />
            </div>
            <Separator />
            {IMAGES.map((img) => (
                <div
                    key={img.id}
                    className="mt-4 flex flex-col items-center gap-3 rounded-md border border-border bg-background p-2">
                    <img
                        src={img.url}
                        alt={img.name}
                        className="h-48 w-full rounded object-cover"
                    />
                    <div>
                        <h4 className="text-sm font-medium text-foreground">{img.name}</h4>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ImagesHistory
