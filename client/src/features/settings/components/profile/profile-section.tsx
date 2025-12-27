import { useUser } from '@clerk/clerk-react'
import { Camera } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function ProfileSection() {
    const { user } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.emailAddresses[0]?.emailAddress || '',
        avatar: user?.imageUrl || ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = () => {
        setIsEditing(false)
        // Handle save logic here
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Profile</h2>
                <p className="text-muted-foreground mt-2">Manage your profile information</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="w-24 h-24">
                                {formData.avatar ? (
                                    <img
                                        src={formData.avatar}
                                        alt=""
                                    />
                                ) : (
                                    <AvatarFallback className="text-lg bg-muted">
                                        {formData.fullName ? formData.fullName.charAt(0) : ''}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            {isEditing && (
                                <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-primary/90 transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        {isEditing && <p className="text-sm text-muted-foreground">Click the camera icon to upload</p>}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground">Full Name</label>
                            <Input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground">Email Address</label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
