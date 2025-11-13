import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react'
import { Trash2Icon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type FC, type MouseEvent } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'

type ResizePosition = 'left' | 'right'

const CustomizedImage: FC<ReactNodeViewProps> = ({ node, editor, selected, updateAttributes, deleteNode }) => {
    const nodeRef = useRef<HTMLDivElement | null>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const [resizing, setResizing] = useState<boolean>(false)
    const [resizingPosition, setResizingPosition] = useState<'left' | 'right'>('left')
    const [resizeInitialWidth, setResizeInitialWidth] = useState(0)
    const [resizeInitialMouseX, setResizeInitialMouseX] = useState(0)

    const handleResizingPosition = (event: MouseEvent<HTMLDivElement>, position: ResizePosition) => {
        event.preventDefault()
        setResizing(true)

        setResizeInitialMouseX(event.clientX)
        if (imageRef.current) {
            setResizeInitialWidth(imageRef.current.clientWidth)
        }
        setResizingPosition(position)
    }

    const resizeImage = useCallback(
        (e: globalThis.MouseEvent) => {
            if (!resizing) return

            let delx = e.clientX - resizeInitialMouseX

            if (resizingPosition === 'left') {
                delx = resizeInitialMouseX - e.clientX
            }

            const newWidth = Math.max(resizeInitialWidth + delx, 50) // Minimum width of 50px
            const parentWidth = nodeRef.current?.parentElement?.offsetWidth || 0

            if (newWidth <= parentWidth) {
                updateAttributes({ width: newWidth })
            }
        },
        [resizing, resizeInitialMouseX, resizeInitialWidth, resizingPosition, updateAttributes]
    )

    function endResizeImage() {
        setResizing(false)
        setResizeInitialMouseX(0)
        setResizeInitialWidth(0)
    }

    useEffect(() => {
        window.addEventListener('mousemove', resizeImage)
        window.addEventListener('mouseup', endResizeImage)

        return () => {
            window.removeEventListener('mousemove', resizeImage)
            window.removeEventListener('mouseup', endResizeImage)
        }
    }, [resizeImage])

    return (
        <NodeViewWrapper
            ref={nodeRef}
            className={cn(
                'relative flex flex-col rounded-md border-2 border-transparent my-2.5',
                selected ? 'border-border' : '',
                node.attrs.align === 'left' && 'left-0 -translate-x-0',
                node.attrs.align === 'center' && 'left-1/2 -translate-x-1/2',
                node.attrs.align === 'right' && 'left-full -translate-x-full'
            )}
            style={{ width: node.attrs.width }}>
            <div className={cn('group relative flex flex-col rounded-md', resizing && '')}>
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    title={node.attrs.title}
                />

                {editor.isEditable && (
                    <>
                        <div
                            className="absolute inset-y-0 z-20 flex w-[1.8rem] cursor-col-resize items-center justify-start p-2"
                            style={{ left: 0 }}
                            onMouseDown={(e) => {
                                handleResizingPosition(e, 'left')
                            }}>
                            <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.1)] opacity-0 transition-all group-hover:opacity-100" />
                        </div>
                        <div
                            className="absolute inset-y-0 z-20 flex w-[1.8rem] cursor-col-resize items-center justify-end p-2"
                            style={{ right: 0 }}
                            onMouseDown={(e) => {
                                handleResizingPosition(e, 'right')
                            }}>
                            <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.1)] opacity-0 transition-all group-hover:opacity-100" />
                        </div>
                        <div className="absolute z-10 flex items-center justify-center end-4 top-2">
                            <Button
                                variant="ghost"
                                className="hover:bg-primary/50"
                                onClick={() => deleteNode()}>
                                <Trash2Icon />
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export default CustomizedImage
