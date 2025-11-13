import { useSignUp } from '@clerk/clerk-react'
import { useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

type OAuthStrategy = 'oauth_google' | 'oauth_github'

export const useOAuth = () => {
    const { isLoaded, signUp } = useSignUp()
    const [loadingProvider, setLoadingProvider] = useState<OAuthStrategy | null>(null)
    const { showBoundary } = useErrorBoundary()

    const handleGoogleSignup = async (oauthStrategy: OAuthStrategy) => {
        if (!isLoaded) return
        // Implement Google signup logic here
        if (oauthStrategy !== 'oauth_google') {
            return
        }
        setLoadingProvider(oauthStrategy)
        try {
            await signUp.authenticateWithRedirect({
                strategy: oauthStrategy,
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/dashboard/`
            })
        } catch (error) {
            showBoundary(error)
            throw error
        } finally {
            setLoadingProvider(null)
        }
    }

    const handleGithubSignup = async (oauthStrategy: OAuthStrategy) => {
        if (!isLoaded) return
        // Implement GitHub signup logic here
        if (oauthStrategy !== 'oauth_github') {
            return
        }
        setLoadingProvider(oauthStrategy)
        try {
            await signUp.authenticateWithRedirect({
                strategy: oauthStrategy,
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/dashboard/`
            })
        } catch (error) {
            setLoadingProvider(null)
            showBoundary(error)
        }
    }

    return {
        loadingProvider,
        handleGoogleSignup,
        handleGithubSignup
    }
}
