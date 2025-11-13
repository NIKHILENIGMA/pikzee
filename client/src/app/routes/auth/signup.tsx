import { type FC } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'

import { LoginFallback } from '@/components'
import AuthLayout from '@/components/layout/auth-layout'
import PublicRoute from '@/components/shared/public-route'
import SignupForm from '@/features/auth/components/signup-form'

const Signup: FC = () => {
    return (
        <PublicRoute>
            <AuthLayout>
                <ErrorBoundary
                    FallbackComponent={({ error, resetErrorBoundary }) => (
                        <LoginFallback
                            error={error}
                            resetError={resetErrorBoundary}
                        />
                    )}>
                    <SignupForm />
                </ErrorBoundary>
                <Toaster />
            </AuthLayout>
        </PublicRoute>
    )
}

export default Signup
