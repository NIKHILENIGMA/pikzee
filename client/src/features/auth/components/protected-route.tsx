import { useUser } from '@clerk/clerk-react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

import { ContainLoader } from '@/components'

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isSignedIn, isLoaded } = useUser()

    if (!isLoaded) {
        // Render a loading indicator while Clerk is loading
        return <ContainLoader />
    }

    if (!isSignedIn) {
        return (
            <Navigate
                to="/auth/login"
                replace
            />
        )
    }

    return children
}

export default ProtectedRoute
