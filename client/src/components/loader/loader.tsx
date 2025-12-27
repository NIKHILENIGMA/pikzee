import type { FC } from 'react'

interface LoaderProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    className?: string
}

// Mapping sizes to Tailwind spacing classes
const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
    xl: 'h-24 w-24 border-8'
}

const Loader: FC<LoaderProps> = ({ size = 'md', color = 'border-blue-500' }) => {
    return (
        <div className="flex items-center justify-center p-4 w-full h-full">
            <div
                className={`
          ${sizeClasses[size] || sizeClasses.md} 
          ${color} 
          animate-spin 
          rounded-full 
          border-t-transparent
        `}
                role="status"
                aria-label="loading">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default Loader
