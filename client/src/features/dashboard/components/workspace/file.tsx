import { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FiSearch, FiPlus } from 'react-icons/fi'

interface Folder {
    id: number
    name: string
    items: number
}

export default function FileManager() {
    const [folders] = useState<Folder[]>([
        { id: 1, name: 'untitled folder', items: 0 },
        { id: 2, name: 'untitled folder', items: 0 }
    ])

    return (
        <div className="min-h-screen bg-[#0E1117] text-gray-200">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-5 text-sm">
                    <button className="font-medium hover:text-white">Appearance</button>
                    <button className="font-medium hover:text-white">Fields</button>
                    <div className="flex items-center space-x-1">
                        <span>Sorted by</span>
                        <button className="text-gray-400 hover:text-white">Custom</button>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <FiSearch className="absolute left-2 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-[#1A1D25] rounded-md pl-8 pr-3 py-1.5 text-sm placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <button className="p-2 bg-[#1A1D25] rounded-md hover:bg-[#2A2D35]">
                        <FiPlus className="text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="text-sm text-gray-400 mb-4">2 Folders • 0 B</div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {folders.map((folder) => (
                        <div
                            key={folder.id}
                            className="bg-[#1A1D25] rounded-md p-4 h-40 flex flex-col justify-between hover:bg-[#232730] transition-colors">
                            <div className="flex justify-between items-start">
                                <input
                                    type="checkbox"
                                    className="accent-indigo-500"
                                />
                                <BsThreeDotsVertical className="text-gray-500 hover:text-gray-300" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-100">{folder.name}</p>
                                <p className="text-xs text-gray-500">{folder.items === 0 ? 'No Items' : `${folder.items} Items`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
