import type { Editor } from '@tiptap/core'
import { type FC, type PointerEvent } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface ColorSelectionProps {
    editor: Editor
}

const COLOR_HEX_CODE = [
    {
        hex: 'default',
        color: 'Default'
    },
    {
        hex: '#FF0000',
        color: 'Red'
    },
    {
        hex: '#43CC43',
        color: 'Green'
    },
    {
        hex: '#171791',
        color: 'Blue'
    },
    {
        hex: '#B8860B',
        color: 'Yellow'
    },
    {
        hex: '#FF00FF',
        color: 'Magenta'
    },
    {
        hex: '#00FFFF',
        color: 'Cyan'
    }
]

const HIGHLIGHT_HEX_CODE = [
    {
        hex: 'default',
        highLight: 'Default'
    },
    {
        hex: '#FF0001',
        highLight: 'Red'
    },
    {
        hex: '#98FB98',
        highLight: 'Green'
    },
    {
        hex: '#87CEEB',
        highLight: 'Blue'
    },
    {
        hex: '#DDA0DD',
        highLight: 'Yellow'
    },
    {
        hex: '#F0E68C',
        highLight: 'Magenta'
    },
    {
        hex: '#FFA07A',
        highLight: 'Cyan'
    }
]

const ColorSelection: FC<ColorSelectionProps> = ({ editor }) => {
    //   const [isOpen, setIsOpen] = useState<boolean>(false);

    const onValueChange = (type: 'highLight' | 'color', hex: string) => {
        if (!editor) return

        if (type === 'highLight' && hex !== 'default') {
            editor.chain().focus().setBackgroundColor(hex).run()
        } else if (type === 'highLight' && hex === 'default') {
            editor.chain().focus().unsetBackgroundColor().run()
        } else if (type === 'color' && hex !== 'default') {
            editor.chain().focus().setColor(hex).run()
        } else if (type === 'color' && hex === 'default') {
            editor.chain().focus().unsetColor().run()
        } else {
            return
        }
    }

    return (
        <Select
            onValueChange={(value) => {
                const selectedColor = COLOR_HEX_CODE.find((color) => color.hex === value)
                if (selectedColor) {
                    onValueChange('color', selectedColor.hex)
                }

                const selectedHighlight = HIGHLIGHT_HEX_CODE.find((hl) => hl.hex === value)
                if (selectedHighlight) {
                    onValueChange('highLight', selectedHighlight.hex)
                }
            }}>
            <SelectTrigger
                className="w-[100px] bg-none hover:bg-transparent"
                onPointerDown={(e: PointerEvent<HTMLButtonElement>) => {
                    // This line prevent content to move from the editor
                    e.preventDefault() // keeps editor selection intact
                    e.stopPropagation() // prevents the editor from losing focus
                }}>
                A
            </SelectTrigger>
            <SelectContent className="overflow-y-auto max-h-72 bg-background text-secondary-foreground">
                <div className="p-1">
                    <div className="mb-2">
                        <span className="text-sm font-semibold">Text Color</span>
                    </div>
                    {COLOR_HEX_CODE.map((color: { hex: string; color: string }, index: number) => (
                        <SelectItem
                            key={color.hex + index}
                            value={color.hex}
                            className="flex items-center">
                            <div
                                style={{
                                    border: `1.5px solid ${color.hex !== 'default' ? `${color.hex}` : 'black'}`,
                                    color: color.hex,
                                    opacity: 0.8,
                                    padding: '0.6rem',
                                    borderRadius: '0.2rem'
                                }}
                                className="inline-flex items-center justify-center w-4 h-4 mr-2 text-sm">
                                A
                            </div>
                            <span className="text-sm">{color.color}</span>
                        </SelectItem>
                    ))}
                </div>
                <Separator className="my-1 border-gray-300" />
                <div className="p-1">
                    <div className="mb-2">
                        <span className="text-sm font-semibold">Highlight Color</span>
                    </div>
                    {HIGHLIGHT_HEX_CODE.map((color: { hex: string; highLight: string }, index: number) => (
                        <SelectItem
                            value={color.hex}
                            key={color.hex + index}>
                            <div
                                style={{
                                    border: '1.5px solid text-secondary',
                                    color: color.hex !== 'default' ? 'white' : 'black',
                                    backgroundColor: color.hex,
                                    opacity: 0.8,
                                    padding: '0.6rem',
                                    borderRadius: '0.2rem'
                                }}
                                className="inline-flex items-center justify-center w-4 h-4 mr-2 text-sm">
                                A
                            </div>
                            <span className="text-sm">{color.highLight}</span>
                        </SelectItem>
                    ))}
                </div>
            </SelectContent>
        </Select>
    )
}

export default ColorSelection
