import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/clerk-react'
import { type FC } from 'react'
import { Link, NavLink } from 'react-router'

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
]

const Header: FC = () => {
    return (
        <header className="w-full bg-transparent fixed top-0 z-20 text-secondary-foreground">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <h1 className="text-2xl font-bold">
                    <Link
                        to="/"
                        className="hover:text-blue-200">
                        ContentApp
                    </Link>
                </h1>
                <nav className="space-x-4">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `hover:text-primary/50 ${isActive ? 'text-primary' : ''}`}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </header>
    )
}

export default Header
