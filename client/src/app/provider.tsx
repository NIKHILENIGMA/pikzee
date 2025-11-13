import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { queryConfig } from '@/shared/lib/react-query'

type AppProviderProps = {
    children: React.ReactNode
}

const MainFallback = () => {
    return <div>Something went wrong!</div>
}

const AppProvider = ({ children }: AppProviderProps) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: queryConfig
            })
    )

    const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

    if (!PUBLISHABLE_KEY) {
        throw new Error('Missing Publishable Key')
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary FallbackComponent={MainFallback}>
                <ClerkProvider
                    publishableKey={PUBLISHABLE_KEY}
                    signInUrl="/auth/login"
                    signUpUrl="/auth/signup">
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider
                            defaultTheme="dark"
                            storageKey="content-app-theme">
                            {children}
                        </ThemeProvider>
                    </QueryClientProvider>
                </ClerkProvider>
            </ErrorBoundary>
        </Suspense>
    )
}

export default AppProvider
