import { Outlet } from 'react-router'

import SettingsSidebar from '@/features/settings/components/setting-sidebar'

export default function SettingsLayout() {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:block">
                <SettingsSidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 bg-background">
                <Outlet />
            </main>
        </div>
    )
}
