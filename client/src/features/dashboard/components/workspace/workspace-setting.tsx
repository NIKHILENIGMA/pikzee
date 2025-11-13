import { Pen, LogOut, Check, XIcon, Building2Icon } from 'lucide-react'
import { useState, type FC } from 'react'

// import { Button } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface WorkspaceSettingProps {
    isOpen: boolean
    onSettingsChange: (open: boolean) => void
}

type WorkspacePhase = 'view' | 'edit'

const WorkspaceSetting: FC<WorkspaceSettingProps> = ({ isOpen, onSettingsChange }) => {
    const [phase, setPhase] = useState<WorkspacePhase>('view')

    const workspaceDetails = {
        name: "Nikhil's Workspace",
        logo: 'https://media.istockphoto.com/id/2228661068/photo/isolated-google-logo-symbolizing-internet-search-and-technology.webp?a=1&b=1&s=612x612&w=0&k=20&c=711C2QCJ2SLkaDr9rZJm3l1TJlqErNAnS3fe0rgcRIg='
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onSettingsChange}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="sm:max-w-[35rem]">
                <DialogHeader>
                    <DialogTitle>Workspace Settings</DialogTitle>
                </DialogHeader>

                <div className="h-40 w-full flex items-center justify-between gap-2 overflow-hidden">
                    {phase === 'view' ? (
                        <div className="w-full">
                            <div className="flex items-start gap-2 p-2 w-full">
                                {/* Workspace logo / avatar */}
                                <div className="h-24 w-[30%] rounded-sm bg-background flex items-center justify-center text-2xl font-semibold">
                                    {workspaceDetails.logo !== '' ? (
                                        <img
                                            src={workspaceDetails.logo}
                                            alt="workspace-logo"
                                            className="object-cover w-full h-full rounded-sm"
                                        />
                                    ) : (
                                        <div className="h-full w-full rounded-sm bg-muted flex items-center justify-center">
                                            <Building2Icon className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="w-[70%] flex-1 flex flex-col">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Name</div>
                                        <div className="text-2xl font-medium">{workspaceDetails.name}</div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPhase('edit')}>
                                            <Pen className="mr-2 h-4 w-4" /> Update Workspace
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                // Handle leave workspace
                                            }}>
                                            <LogOut className="mr-2 h-4 w-4" /> Leave Workspace
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="flex items-center gap-4 px-6">
                                {/* Workspace logo / avatar */}
                                <div className="w-32 rounded-sm flex items-center justify-center text-2xl font-semibold flex-col p-4 space-y-1">
                                    <img
                                        src="https://media.istockphoto.com/id/2228661068/photo/isolated-google-logo-symbolizing-internet-search-and-technology.webp?a=1&b=1&s=612x612&w=0&k=20&c=711C2QCJ2SLkaDr9rZJm3l1TJlqErNAnS3fe0rgcRIg="
                                        alt="workspace-logo"
                                        className="object-cover w-full h-full rounded-sm"
                                    />
                                    <Button variant={'profile'}>
                                        <Pen className="h-4 w-4" /> Upload
                                    </Button>
                                    <Input
                                        type="file"
                                        className="hidden"
                                    />
                                </div>
                                <div className="w-full">
                                    <Label className="text-sm text-muted-foreground">Name of the Workspace</Label>
                                    <Input
                                        aria-label="Workspace name"
                                        // value={draft}
                                        // onChange={(e) => setDraft(e.target.value)}
                                        className="mt-1 w-full"
                                        defaultValue="My Workspace"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mr-2"
                                            onClick={() => setPhase('view')}>
                                            <XIcon /> Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => setPhase('view')}>
                                            <Check /> Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default WorkspaceSetting
