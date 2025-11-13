import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { cn } from '@/shared/lib/utils'

interface LogoProps {
    logoPath: string
    redirectTo: string
    classes?: string
}

const Logo: FC<LogoProps> = ({ logoPath, classes, redirectTo }) => {
    const navigate = useNavigate()
    return (
        <div
            className={'w-10 h-10 flex items-center justify-center cursor-pointer'}
            onClick={() => {
                navigate(redirectTo)
            }}>
            <img
                src={logoPath}
                alt="logo"
                className={cn('w-full h-full object-cover', classes)}
            />
        </div>
    )
}

export default Logo
