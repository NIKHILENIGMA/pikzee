import { type FC } from 'react'
import { Link } from 'react-router'

const Footer: FC = () => {
    return (
        <footer className="bg-background text-secondary-foreground py-4 mt-8">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
                <span className="text-sm">&copy; {new Date().getFullYear()} Content App. All rights reserved.</span>
                <nav className="flex space-x-4 mt-2 md:mt-0">
                    <Link
                        to="/"
                        className="hover:underline">
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className="hover:underline">
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className="hover:underline">
                        Contact
                    </Link>
                </nav>
            </div>
        </footer>
    )
}

export default Footer
