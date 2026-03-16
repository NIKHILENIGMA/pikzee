import type { FC } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const unsplashImages = [
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1773088843510-277540282242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 1',
        credits: 'Nikhil'
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 2',
        credits: 'Nikhil'
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 3',
        credits: 'Nikhil'
    },
    {
        id: 4,
        url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 4',
        credits: 'Nikhil'
    },
    {
        id: 5,
        url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 5',
        credits: 'Nikhil'
    },
    {
        id: 7,
        url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 7',
        credits: 'Nikhil'
    },
    {
        id: 8,
        url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 8',
        credits: 'Nikhil'
    },
    {
        id: 9,
        url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 9',
        credits: 'Nikhil'
    },
    {
        id: 10,
        url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 10',
        credits: 'Nikhil'
    },
    {
        id: 11,
        url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        alt: 'Random Unsplash Image 11',
        credits: 'Nikhil'
    }
]

const UnsplashTab: FC = () => {
    return (
        <div className="p-2">
            <div className="flex flex-col items-start gap-2 mb-4">
                <Label
                    htmlFor="unsplash-search"
                    className="text-sm font-medium text-muted-foreground">
                    Search Unsplash:
                </Label>
                <div className="flex gap-2 w-full">
                    <Input
                        type="text"
                        id="unsplash-search"
                        placeholder="Search for images..."
                        className="w-full"
                    />
                </div>
            </div>
            <div className="max-h-[45vh] overflow-y-auto pl-1 minimal-scrollbar scroll-smooth">
                <div className="grid grid-cols-4 gap-2">
                    {/* Map over unsplash results here */}
                    {unsplashImages.map((image) => (
                        <div
                            key={image.id}
                            className="w-full flex flex-col items-center gap-1">
                            <img
                                src={image.url}
                                className="w-full h-[100px] bg-muted rounded cursor-pointer object-cover hover:opacity-80 object-top"
                                alt={image.alt}
                            />
                            <p className="text-sm text-start text-muted-foreground w-full">
                                By <span className="underline"> {image.credits}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Powered by Unsplash</p>
        </div>
    )
}

export default UnsplashTab
