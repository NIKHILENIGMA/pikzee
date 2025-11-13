import type { FC } from 'react'
import { Outlet } from 'react-router'

import Sidebar from '../shared/sidebar'

const DashboardLayout: FC = () => {
    return (
        <div className="w-full flex">
            <Sidebar />
            <div className="flex-1 w-[95%] min-h-screen overflow-y-auto">
                {/* Main content goes here */}
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout
