import { Download, Copy, MoveRight, MoreHorizontal, X } from 'lucide-react'
import type { FC } from 'react'

interface AssetActionbarProps {
    selectedItems: Set<string>
    fileItems: {
        id: string
        name: string
        type: 'file' | 'folder'
        fileSize?: number
    }[]
    sidebarOpen: boolean
    setSelectedItems: (items: Set<string>) => void
}

const AssetActionbar: FC<AssetActionbarProps> = ({ selectedItems, fileItems, sidebarOpen, setSelectedItems }) => {
    const calculateTotalSize = () => {
        let total = 0
        selectedItems.forEach((id) => {
            const item = fileItems.find((f) => f.id === id)
            if (item?.fileSize) {
                total += item.fileSize
            }
        })
        return (total / 1024).toFixed(1) // Convert to GB
    }

    const countFolders = () => {
        return Array.from(selectedItems).filter((id) => fileItems.find((f) => f.id === id)?.type === 'folder').length
    }
    return (
        <div
            className={`fixed bottom-0 right-0 bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-between ${sidebarOpen ? 'left-64' : 'left-0'}`}>
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-200 font-medium">
                    {selectedItems.size} {countFolders() > 0 ? 'Folder' : 'File'}s selected
                </span>
                <span className="text-sm text-slate-400">• {calculateTotalSize()} GB</span>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-800 rounded transition-colors">
                    <MoreHorizontal
                        size={18}
                        className="text-slate-400"
                    />
                </button>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                        <MoveRight size={16} />
                        Move to
                    </button>
                    <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                        <Copy size={16} />
                        Copy to
                    </button>
                    <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                        <Download size={16} />
                        Download
                    </button>
                </div>
                <button
                    onClick={() => setSelectedItems(new Set())}
                    className="p-2 hover:bg-slate-800 rounded transition-colors">
                    <X
                        size={18}
                        className="text-slate-400"
                    />
                </button>
            </div>
        </div>
    )
}

export default AssetActionbar
