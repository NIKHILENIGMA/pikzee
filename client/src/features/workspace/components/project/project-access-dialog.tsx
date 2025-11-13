import { KeyRound, UserRoundMinus } from 'lucide-react'
import { type FC } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const memberAccess = [
    {
        id: 1,
        name: 'Sunita Williams',
        email: 'sunitawilliams@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=1000'
    },
    {
        id: 2,
        name: 'Sam Willsons',
        email: 'samwillsons@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=700'
    },
    {
        id: 3,
        name: 'Shushant Singh',
        email: 'shushantsingh@gmail.com',
        avatar: 'https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=700'
    }
]

const ProjectAccessDialog: FC = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'ghost'}
                    size={'sm'}
                    className="w-full text-start hover:bg-secondary rounded-sm justify-start ">
                    <KeyRound /> <span>Manage Access</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Project Settings</DialogTitle>
                    <DialogDescription>Manage the access levels of your project members.</DialogDescription>
                    <div className="my-4 flex items-end space-x-2">
                        <div className="w-full flex flex-col space-y-1">
                            <Label htmlFor="member-access">Provide access to:</Label>
                            <Input
                                id="member-access"
                                placeholder="john.doe@example.com or @johndoe"
                                className="w-full"
                            />
                        </div>
                        <Button variant={'secondary'}>Give Access</Button>
                    </div>
                    <Separator />
                    <div className="mt-4">
                        {/* Access settings content goes here */}
                        <div className="flex flex-col items-start border-border border-2 p-4 rounded-md ">
                            <h3 className="font-medium text-xl">Member have access</h3>
                            {memberAccess.length === 0 ? (
                                <p className="text-sm text-foreground/70 mt-2">No members have access to this project.</p>
                            ) : (
                                memberAccess.map((member) => (
                                    <div
                                        key={member.id}
                                        className="w-full flex items-center mt-2 justify-between">
                                        <div className="w-[90%] flex items-center p-1">
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                            <div className="ml-2 font-medium text-md flex flex-col items-start">
                                                <span>{member.name}</span>
                                                <span className="text-foreground/50">{member.email}</span>
                                            </div>
                                        </div>
                                        <div className="action w-[10%] flex items-center justify-center">
                                            <Button
                                                onClick={() => {
                                                    //todo: open remove member dialog
                                                }}
                                                className="p-2 rounded-md cursor-pointer bg-destructive/20 hover:bg-destructive/80 border-destructive border-2 transition-all">
                                                <UserRoundMinus />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ProjectAccessDialog
