import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function DangerZoneSection() {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [confirmText, setConfirmText] = useState('')

    const handleDeleteAccount = () => {
        // Handle account deletion logic here
        console.log('Account deleted')
        setIsDeleteDialogOpen(false)
    }

    const isConfirmValid = confirmText === 'DELETE MY ACCOUNT'

    return (
        <Card className="border-destructive/20">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <div>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>Irreversible actions that will affect your account</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-1">
                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="lg">
                            Delete Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. Your account and all associated data will be permanently deleted.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <p className="text-sm text-foreground">
                                To confirm, type <span className="font-semibold">DELETE MY ACCOUNT</span> below:
                            </p>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="DELETE MY ACCOUNT"
                                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={!isConfirmValid}>
                                Delete Account
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
