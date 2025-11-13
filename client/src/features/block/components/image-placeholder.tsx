import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { Image, Link, Plus } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type DragEvent, type FC } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/shared/lib/utils'

const ImagePlaceholder: FC<ReactNodeViewProps> = ({ selected, deleteNode, extension, editor }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [url, setUrl] = useState<string>('')
    const [open, setOpen] = useState<boolean>(false)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [isDragReject, setIsDragReject] = useState<boolean>(false)

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        setIsDragReject(false)
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        setIsDragReject(false)

        const files = Array.from(e.dataTransfer.files)
        for (const file of files) {
            const fileReader = new FileReader()

            fileReader.onload = () => {
                const src = fileReader.result as string
                editor.commands.setImage({ src })
            }

            fileReader.readAsDataURL(file)
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const files = Array.from(e.target.files || [])

        if (files.length === 0) return

        for (const file of files) {
            const fileReader = new FileReader()

            fileReader.onload = () => {
                const src = fileReader.result as string
                editor.commands.setImage({ src })
                editor.commands.enter()
            }

            fileReader.readAsDataURL(file)
        }
    }

    const handleDelete = () => {
        deleteNode()
    }

    const handleEmbed = () => {
        if (url) {
            editor.commands.setImage({ src: url })
            setUrl('')
            setOpen(false)
        }
    }

    return (
        <NodeViewWrapper
            className="w-full image-placeholder"
            contentEditable={false}>
            <Popover
                modal
                open={open}>
                <PopoverTrigger
                    asChild
                    onClick={() => setOpen(true)}
                    className="w-full">
                    <div
                        className={cn(
                            'flex items-center space-x-2 bg-accent rounded-md p-4 mt-2 mb-4 justify-between',
                            selected && 'bg-primary/20 hover:bg-primary/30 select-none'
                        )}>
                        <div className="flex items-center space-x-2">
                            <Image /> <span>Add Image</span>
                        </div>
                        <div className="flex items-center justify-center w-6 h-6 rotate-45 rounded-full cursor-pointer">
                            <Plus onClick={handleDelete} />
                        </div>
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    onPointerDownOutside={() => setOpen(false)}
                    onEscapeKeyDown={() => setOpen(false)}
                    className="w-md">
                    <Tabs
                        defaultValue="upload"
                        className="w-full">
                        <TabsList className="w-full space-x-3 bg-transparent">
                            <TabsTrigger
                                value="upload"
                                className="p-2">
                                Image Upload
                            </TabsTrigger>
                            <TabsTrigger
                                value="url"
                                className="p-2">
                                Embedded URL
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="upload"
                            className="flex flex-col w-full">
                            <div
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => inputRef.current?.click()}
                                className={cn(
                                    'flex flex-col items-center justify-center h-48 p-5 border-2 border-dashed rounded-sm cursor-pointer border-primary/50 hover:bg-primary/5 hover:border-primary/70 hover:text-accent-foreground/95',
                                    isDragging && 'bg-primary/5 border-primary/70',
                                    isDragReject && 'border-red-500 text-red-500'
                                )}>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept={Object.keys(extension.options.allowedMimeTypes || {}).join(',')}
                                    multiple={extension.options.maxFiles !== 1}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    ref={inputRef}
                                />
                                <Image />
                                <Label htmlFor="image-upload">Drag and drop an image here</Label>
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="url"
                            className="flex flex-col items-start w-full h-full space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <div className="relative flex flex-col w-full">
                                <Link className="absolute left-2 top-2 text-accent-foreground" />
                                <Input
                                    id="image-url"
                                    type="url"
                                    placeholder="Enter image URL"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="px-8"
                                />
                            </div>
                            <Button
                                type="button"
                                className="w-full"
                                onClick={handleEmbed}>
                                Embed
                            </Button>
                        </TabsContent>
                    </Tabs>
                </PopoverContent>
            </Popover>
        </NodeViewWrapper>
    )
}

export default ImagePlaceholder
