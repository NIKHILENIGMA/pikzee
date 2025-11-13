import { Outlet } from 'react-router'

import SettingsSidebar from '@/features/settings/components/setting-sidebar'

export default function SettingsLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex">
                {/* Sidebar */}
                <SettingsSidebar />

                {/* Main Content */}
                <div className="w-full min-h-screen">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
