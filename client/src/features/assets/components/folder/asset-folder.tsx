import { type FC, type FocusEvent } from 'react'

import { Checkbox } from '@/components/ui/checkbox'

import AssetContextOptions from '../asset-context-options'

interface AssetFolderProps {
    selected?: boolean
    item: {
        id: string
        name: string
        type: 'file' | 'folder'
        fileSize?: number
        items?: number
    }
}

const AssetFolder: FC<AssetFolderProps> = ({ selected, item }) => {
    const handleBlur = (e: FocusEvent<HTMLParagraphElement, Element>) => {
        // Here you can handle the updated name, e.g., send it to a server or update state
        console.log('Updated folder name:', e.target.innerText)
    }
    return (
        <AssetContextOptions>
            <div className="relative w-full aspect-[627/600] rounded-md overflow-hidden transition-colors cursor-pointer group">
                {/* SVG OUTER FOLDER */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 627 510"
                    fill="var(--folder-bg)"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true">
                    <path
                        stroke={selected ? '#7033ff' : ''}
                        strokeWidth="6"
                        d="
                    M161.338 0
                    C167.364 0 172.923 2.96731 177.081 7.32871
                    C190.985 21.9122 210.602 31 232.342 31
                    H608
                    C618.493 31 627 39.5066 627 50
                    V533
                    C627 543.493 618.493 552 608 552
                    H19
                    C8.50657 552 0 543.493 0 533
                    V19
                    C0 8.50659 8.50659 0 19 0
                    H161.338
                    Z
                    "
                    />
                </svg>

                {/* INNER CONTENT — PROPER FRAME GAP */}
                <div className="absolute inset-[2.1px] top-[42px] bg-secondary rounded-b-sm rounded-t-sm shadow-xl flex flex-col justify-between overflow-hidden">
                    <div className="p-4">
                        <Checkbox className="data-[state=checked]:border-border data-[state=checked]:bg-primary data-[state=checked]:text-foreground dark:data-[state=checked]:border-border dark:data-[state=checked]:bg-primary dark:data-[state=checked]:text-foreground" />
                    </div>

                    <div className="mt-auto px-4 pb-3">
                        <p
                            className="text-md font-semibold"
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={handleBlur}>
                            {item.name}
                        </p>
                        <div className="flex justify-between items-center text-sm text-foreground/60">
                            <span>{item.items} Items</span>
                            <span>⋮</span>
                        </div>
                    </div>
                </div>
            </div>
        </AssetContextOptions>
    )
}

export default AssetFolder
