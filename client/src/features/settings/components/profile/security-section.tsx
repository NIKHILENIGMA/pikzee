import { useClerk } from '@clerk/clerk-react'
import { useState, type ChangeEvent } from 'react'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export default function SecuritySection() {
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const { client } = useClerk()
    const lastStrategy = client?.lastAuthenticationStrategy

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePasswordSave = () => {
        // Handle password change logic here
        setIsPasswordDialogOpen(false)
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    }

    const handleDisconnect = (provider: string) => {
        // Handle disconnect logic here
        alert(`Disconnected from ${provider}`)
    }
    const providers = [
        { strategy: 'oauth_google' as const, name: 'Google' },
        { strategy: 'oauth_github' as const, name: 'GitHub' }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Security</h2>
                <p className="text-muted-foreground mt-2">Manage your password and connected accounts</p>
            </div>

            {/* Password Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password regularly to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                    <Dialog
                        open={isPasswordDialogOpen}
                        onOpenChange={setIsPasswordDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Change Password</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>Enter your current password and a new password</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground">Current Password</label>
                                    <Input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">New Password</label>
                                    <Input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Confirm Password</label>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsPasswordDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handlePasswordSave}>Update Password</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Connected Accounts Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Connected Accounts</CardTitle>
                    <CardDescription>Manage your connected social accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Google Account */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center">
                                <FcGoogle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">Google</p>
                                <p className="text-sm text-muted-foreground">nickharmalkar18@gmail.com</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect('Google')}>
                            {lastStrategy === providers[0].strategy ? 'Disconnect' : 'Connect'}
                        </Button>
                    </div>

                    {/* GitHub Account */}
                    {/* <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                                <BsGithub className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">GitHub</p>
                                <p className="text-sm text-muted-foreground">johndoe</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect('GitHub')}>
                            Disconnect
                        </Button>
                    </div> */}
                </CardContent>
            </Card>
        </div>
    )
}
