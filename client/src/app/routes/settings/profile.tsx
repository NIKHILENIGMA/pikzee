import { type FC } from 'react'

import ActiveDevicesSection from '@/features/settings/components/profile/active-devices-section'
import DangerZoneSection from '@/features/settings/components/profile/danger-zone-section'
import ProfileSection from '@/features/settings/components/profile/profile-section'
import SecuritySection from '@/features/settings/components/profile/security-section'

const Profile: FC = () => {
    return (
        <div
            id="settings-container"
            className="min-h-screen bg-background overflow-y-auto">
            <div className="max-w-3xl mx-auto p-6 space-y-10">
                {/* Profile Section */}
                <ProfileSection />

                {/* Security Section */}
                <SecuritySection />

                {/* Account Section */}
                <ActiveDevicesSection />

                {/* Danger Zone Section */}
                <DangerZoneSection />
            </div>
        </div>
    )
}

export default Profile
