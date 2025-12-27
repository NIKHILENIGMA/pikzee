import { Smartphone, Monitor, Tablet } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Device {
    id: string
    name: string
    location: string
    lastActive: string
    type: 'phone' | 'desktop' | 'tablet'
}

export default function ActiveDevicesSection() {
    const devices: Device[] = [
        {
            id: '1',
            name: 'MacBook Pro',
            location: 'San Francisco, CA',
            lastActive: 'Active now',
            type: 'desktop'
        },
        {
            id: '2',
            name: 'iPhone 14',
            location: 'San Francisco, CA',
            lastActive: '2 hours ago',
            type: 'phone'
        },
        {
            id: '3',
            name: 'iPad Air',
            location: 'San Francisco, CA',
            lastActive: '1 day ago',
            type: 'tablet'
        }
    ]

    const getDeviceIcon = (type: Device['type']) => {
        switch (type) {
            case 'phone':
                return <Smartphone className="w-5 h-5" />
            case 'tablet':
                return <Tablet className="w-5 h-5" />
            case 'desktop':
                return <Monitor className="w-5 h-5" />
        }
    }

    const handleLogout = (deviceId: string) => {
        // Handle logout logic here
        setTimeout(() => {
            alert(`Logged out from device with ID: ${deviceId}`)
        }, 500)
        // console.log(`Logout from device: ${deviceId}`)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Active Devices</h2>
                <p className="text-muted-foreground mt-2">Manage your connected devices</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Devices</CardTitle>
                    <CardDescription>Review and manage devices accessing your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {devices.map((device) => (
                            <div
                                key={device.id}
                                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                        {getDeviceIcon(device.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{device.name}</p>
                                        <p className="text-sm text-muted-foreground">{device.location}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{device.lastActive}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleLogout(device.id)}>
                                    Logout
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
