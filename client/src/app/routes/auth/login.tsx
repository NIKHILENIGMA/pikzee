import { ErrorBoundary } from 'react-error-boundary'

import { LoginFallback } from '@/components'
import AuthLayout from '@/components/layout/auth-layout'
import PublicRoute from '@/components/shared/public-route'
import { Toaster } from '@/components/ui/sonner'
import { LoginForm } from '@/features/auth'

export default function LoginPage() {
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
                    <LoginForm />
                </ErrorBoundary>
                <Toaster />
            </AuthLayout>
        </PublicRoute>
    )
}
