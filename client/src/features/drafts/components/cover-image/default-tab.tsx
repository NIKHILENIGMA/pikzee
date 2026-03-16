import type { FC } from 'react'

import { Separator } from '@/components/ui/separator'
import { useDraftContext } from '../../hooks/use-draft-context'
import { toast } from 'sonner'


interface DefaultImage {
    id: number
    url: string
    alt: string
}

interface DefaultCategory {
    type: string
    images: DefaultImage[]
}

const defaultCoverImages: DefaultCategory[] = [
    {
        type: 'gradient',
        images: [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1773088843510-277540282242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8',
                alt: 'Default Gradient 1'
            },
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Gradient 2'
            },
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Gradient 3'
            },
            {
                id: 4,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Gradient 4'
            },
            {
                id: 5,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Gradient 5'
            },
            {
                id: 6,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Gradient 6'
            }
        ]
    },
    {
        type: 'pattern',
        images: [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1773088843510-277540282242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 1'
            },
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 2'
            },
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 3'
            },
            {
                id: 4,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 4'
            }
        ]
    },
    {
        type: 'nature',
        images: [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1773088843510-277540282242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 1'
            },
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 2'
            },
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 3'
            },
            {
                id: 4,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 4'
            }
        ]
    },
    {
        type: 'abstract',
        images: [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1773088843510-277540282242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 1'
            },
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 2'
            },
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 3'
            },
            {
                id: 4,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 4'
            }
        ]
    },
    {
        type: 'technology',
        images: [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1773088843510-277540282242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 1'
            },
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 2'
            },
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 3'
            },
            {
                id: 4,
                url: 'https://images.unsplash.com/photo-1773270580250-130add80e26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw9fHx8ZW58MHx8fHx8',
                alt: 'Default Cover Image 4'
            }
        ]
    }
]

const DefaultTab: FC = () => {
    const { updateDraft } = useDraftContext()

    const handleSelectCover = (url: string) => {
        updateDraft({
            coverImageUrl: url
        })
        // Todo: Do api call to update cover image in db and handle loading state and errors
        toast.success('Cover image updated successfully!')
    }

    return (
        <div className="max-h-[45vh] overflow-y-auto pl-2.5 pr-1 minimal-scrollbar scroll-smooth">
            {defaultCoverImages.map((category, index) => (
                <div
                    key={category.type + index}
                    className="mb-4">
                    <h4 className="text-sm text-muted-foreground font-medium pb-1.5 uppercase">{category.type}</h4>
                    <div className="grid grid-cols-4 gap-2 pb-2.5">
                        {category.images.map((image) => (
                            <img
                                onClick={() => handleSelectCover(image.url)}
                                key={image.id}
                                src={image.url}
                                alt={image.alt}
                                className="h-[100px] w-full object-cover rounded cursor-pointer hover:opacity-80"
                            />
                        ))}
                    </div>
                    <Separator orientation="horizontal" />
                </div>
            ))}
        </div>
    )
}

export default DefaultTab
