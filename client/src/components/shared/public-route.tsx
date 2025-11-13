import { useUser } from '@clerk/clerk-react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

import ContainLoader from '../loader/contain-loader'

interface PublicRouteProps {
    children: ReactNode
    redirectTo?: string
}

const PublicRoute = ({ children, redirectTo = '/ws' }: PublicRouteProps) => {
    const { user, isLoaded } = useUser()

    if (!isLoaded) {
        return <ContainLoader />
    }

    if (user) {
        // If user is authenticated, redirect to dashboard
        return (
            <Navigate
                to={redirectTo}
                replace
            />
        )
    }

    return <>{children}</>
}

export default PublicRoute
