import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function Navigation() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const navigate = useNavigate()

    const navLinks = [
        { label: 'Features', href: '#features' },
        { label: 'Integrations', href: '#integrations' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Docs', href: '#docs' }
    ]

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between sm:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-2xl">
                            Pikzee
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex">
                        <Button
                            variant="default"
                            onClick={() => navigate('/auth/login')}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden"
                        aria-label="Toggle menu">
                        {isOpen ? (
                            <X className="h-6 w-6 text-zinc-900 dark:text-white" />
                        ) : (
                            <Menu className="h-6 w-6 text-zinc-900 dark:text-white" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="border-t border-zinc-200 pb-4 dark:border-zinc-800 md:hidden">
                        <div className="space-y-2 py-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                                    onClick={() => setIsOpen(false)}>
                                    {link.label}
                                </a>
                            ))}
                            <Button
                                variant="default"
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                                Get Started
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
