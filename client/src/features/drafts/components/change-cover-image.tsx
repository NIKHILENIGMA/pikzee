import { type FC, type ReactNode } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import DefaultTab from './cover-image/default-tab'
import UploadTab from './cover-image/upload-tab'
import UrlTab from './cover-image/url-tab'
import UnsplashTab from './cover-image/unsplash-tab'

interface ChangeCoverImageProps {
    children: ReactNode
    onRemoveCover: () => void
}

const tabListOptions = [
    { value: 'default', label: 'Presets' },
    { value: 'upload', label: 'Upload' },
    { value: 'url', label: 'Link' },
    { value: 'unsplash', label: 'Unsplash' }
]

const ChangeCoverImage: FC<ChangeCoverImageProps> = ({ children, onRemoveCover }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                className="w-[80vh] p-0"
                align="end">
                <Tabs
                    defaultValue="default"
                    className="w-full">
                    <div className="border-b flex items-center justify-between px-3 py-1.5">
                        <TabsList className="bg-transparent grid w-[55%] grid-cols-4">
                            {tabListOptions.map((option) => (
                                <TabsTrigger
                                    value={option.value}
                                    className="data-[state=active]:shadow-xs">
                                    {option.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <button
                            onClick={onRemoveCover}
                            className="text-sm text-muted-foreground hover:text-foreground">
                            Remove
                        </button>
                    </div>
                    <div className="p-2">
                        <TabsContent value="default">
                            <DefaultTab />
                        </TabsContent>
                        <TabsContent value="upload">
                            <UploadTab />
                        </TabsContent>
                        <TabsContent value="url">
                            <UrlTab />
                        </TabsContent>
                        <TabsContent value="unsplash">
                            <UnsplashTab />
                        </TabsContent>
                    </div>
                </Tabs>
            </PopoverContent>
        </Popover>
    )
}

export default ChangeCoverImage
