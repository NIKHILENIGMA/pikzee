import { useState, type FC } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface WorkspaceSwitchProps {
    isOpen: boolean
    onSettingsChange: (open: boolean) => void
}

const WorkspaceSwitch: FC<WorkspaceSwitchProps> = ({ isOpen, onSettingsChange }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState('My Workspace')
    const [draft, setDraft] = useState(name)

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onSettingsChange}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Workspace Settings</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Workspace logo / avatar */}
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold">
                                {name.slice(0, 2).toUpperCase()}
                            </div>

                            {/* Name / edit field */}
                            {!isEditing ? (
                                <div>
                                    <div className="text-sm text-muted-foreground">Workspace</div>
                                    <div className="text-lg font-medium">{name}</div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        aria-label="Workspace name"
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <button
                                        onClick={() => {
                                            setName(draft.trim() || name)
                                            setIsEditing(false)
                                        }}
                                        className="px-3 py-1 rounded bg-blue-600 text-white">
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDraft(name)
                                            setIsEditing(false)
                                        }}
                                        className="px-3 py-1 rounded border">
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    // simple "leave" action: close dialog. Replace with real leave logic as needed.
                                    onSettingsChange(false)
                                }}
                                className="px-3 py-1 rounded border text-red-600">
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default WorkspaceSwitch
