import { useUser } from '@clerk/clerk-react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

import ContainLoader from '../loader/contain-loader'

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoaded } = useUser()
    const location = useLocation()

    if (!isLoaded) {
        return <ContainLoader /> // You can replace with a proper loading component
    }

    if (!user) {
        // Redirect to login with the current location so user can be redirected back after login
        return (
            <Navigate
                to="/auth/login"
                state={{ from: location }}
                replace
            />
        )
    }

    return <>{children}</>
}

export default ProtectedRoute
