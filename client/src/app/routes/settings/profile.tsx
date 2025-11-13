import { type FC } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const Profile: FC = () => {
    return (
        <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">Profile</h1>
            </div>

            {/* Personal Info Section */}
            <div className="mb-8">
                <div className="mb-4">
                    <h2 className="text-lg font-medium mb-1">Personal Info</h2>
                    <p className="text-sm text-muted-foreground">Set up your profile.</p>
                </div>

                <Card className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16 bg-purple-500">
                                <AvatarFallback className="text-white text-lg font-medium bg-purple-500">NH</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium text-lg">Nikhil Harmalkar</h3>
                                <p className="text-sm text-muted-foreground">(UTC+05:30) Asia / Kolkata</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm">
                            Edit
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Authentication Section */}
            <div className="mb-8">
                <div className="mb-4">
                    <h2 className="text-lg font-medium mb-1">Authentication</h2>
                    <p className="text-sm text-muted-foreground">Changes to your authentication will apply to all accounts you're a member of.</p>
                </div>

                <div className="space-y-4">
                    <Card className="p-4 bg-card border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">nickharmalkar16@gmail.com</p>
                            </div>
                            <Button
                                variant="link"
                                className="text-blue-400 hover:text-blue-300">
                                Manage on Adobe ↗
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-4 bg-card border-border">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Log Out Of All Active Sessions</p>
                            <Button
                                variant="outline"
                                size="sm">
                                Log Out
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Cookie Preferences Section */}
            <div>
                <div className="mb-4">
                    <h2 className="text-lg font-medium mb-1">Cookie Preferences</h2>
                    <p className="text-sm text-muted-foreground">Set how your data and cookie preferences are handled.</p>
                </div>

                <Card className="p-4 bg-card border-border">
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Cookie Preferences</p>
                        <Button
                            variant="outline"
                            size="sm">
                            Edit
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Profile
