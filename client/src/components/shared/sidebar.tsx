import { useClerk, useUser } from '@clerk/clerk-react'
import { Dock, Home, LogOut, MagnetIcon, Settings, Sparkles } from 'lucide-react'
import type { FC } from 'react'
import { NavLink, useNavigate } from 'react-router'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import Logo from '../logo/logo'
import { Button } from '../ui/button'

import { ModeToggle } from './../theme/mode-toggle'

interface NavItem {
    to: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    label: string
}

const NAV_LINKS: NavItem[] = [
    {
        to: '/ws',
        icon: Home,
        label: 'Home'
    },
    {
        to: '/documents',
        icon: Dock,
        label: 'Projects'
    },
    {
        to: '/magic-editor',
        icon: Sparkles,
        label: 'Magic Editor'
    },
    {
        to: '/media-scheduler',
        icon: MagnetIcon,
        label: 'Integrations'
    }
]

const Sidebar: FC = () => {
    const { user, isLoaded } = useUser()
    const navigate = useNavigate()
    const { signOut } = useClerk()
    if (!isLoaded) return null

    const userInitials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`

    const handleLogout = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <aside className={'hidden md:w-[5%] h-screen bg-sidebar sticky top-0 p-4 md:flex flex-col items-center justify-between z-50'}>
            <Logo
                logoPath="../../../dummylogo.jpg"
                classes="rounded-lg"
                redirectTo={'/ws'}
            />
            <nav className="mt-10 flex flex-col items-center space-y-4 h-[80%]">
                {NAV_LINKS.map((link: NavItem, idx: number) => (
                    <NavLink
                        key={link.to + idx}
                        to={link.to}
                        end={link.to === '/dashboard'}
                        className={({ isActive }: { isActive: boolean }) =>
                            `${isActive ? 'text-primary' : 'text-foreground/80'} p-3 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer`
                        }>
                        {link.icon && <link.icon />}
                    </NavLink>
                ))}
            </nav>
            <div className="mb-4 flex flex-col items-center">
                <div className="w-full flex justify-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'profile'}
                                size={'icon'}>
                                {userInitials}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            className="w-48 p-0 bg-card">
                            <div className="flex flex-col items-center w-full py-6">
                                {/* User Image */}
                                <div className="mb-3">
                                    <img
                                        src={user?.imageUrl || '/default-avatar.png'}
                                        alt="User Avatar"
                                        className="w-16 h-16 rounded-full border-4 border-primary object-cover mx-auto"
                                    />
                                </div>
                                {/* Full Name */}
                                <div className="text-center mb-4">
                                    <span className="font-semibold text-sm">
                                        {user?.firstName} {user?.lastName}
                                    </span>
                                </div>
                                {/* Buttons */}
                                <div className="flex flex-col gap-2 w-full px-4">
                                    <Button
                                        variant="ghost"
                                        className="w-full flex justify-start"
                                        onClick={() => navigate('/settings')}>
                                        <Settings /> Setting
                                    </Button>
                                    {/* Theme Button */}
                                    <ModeToggle />
                                    <Button
                                        className="w-full justify-start bg-transparent hover:bg-red-600 text-red-400 hover:text-white border border-red-400"
                                        onClick={handleLogout}>
                                        <LogOut /> Logout
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
