import { User, Bell, BarChart3, CreditCard, Receipt } from 'lucide-react'
import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

const SETTINGS_SIDEBAR_LINKS = [
    {
        section: 'Personal',
        links: [{ name: 'Profile', icon: User }]
    },
    {
        section: 'Account',
        links: [
            { name: 'Workspace', icon: Bell },
            { name: 'Usage', icon: BarChart3 },
            { name: 'Integration', icon: Bell },
            { name: 'Plans', icon: CreditCard },
            { name: 'Billing', icon: Receipt }
        ]
    }
]

const SettingsSidebar: FC = () => {
    const navigate = useNavigate()
    return (
        <div className="h-full w-64 bg-sidebar/70 text-foreground p-4 space-y-4">
            {/* Personal Section */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Personal</h3>
                <div className="space-y-1">
                    {SETTINGS_SIDEBAR_LINKS[0].links.map((link) => (
                        <Button
                            key={link.name}
                            variant="ghost"
                            onClick={() => navigate('/settings')}
                            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Account Section */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Account</h3>
                <div className="space-y-1">
                    {SETTINGS_SIDEBAR_LINKS[1].links.map((link) => (
                        <Button
                            key={link.name}
                            variant="ghost"
                            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                            onClick={() => navigate(`/settings/${link.name.toLowerCase()}`)}>
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.name}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SettingsSidebar
