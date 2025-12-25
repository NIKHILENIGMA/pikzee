import { useSignUp } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useSearchParams } from 'react-router'

type OAuthStrategy = 'oauth_google' | 'oauth_github'

export const useOAuth = () => {
    const { isLoaded, signUp } = useSignUp()
    const [loadingProvider, setLoadingProvider] = useState<OAuthStrategy | null>(null)
    const { showBoundary } = useErrorBoundary()
    const [searchParams, setSearchParams] = useSearchParams()

    // Handle invitation token from URL query parameters
    const token = searchParams.get('invitationToken') || null

    useEffect(() => {
        if (!token || !isLoaded || !signUp) return

        const handleInvitationToken = async () => {
            try {
                await signUp.update({ unsafeMetadata: { 'invite_token': token } })

                // Remove token from URL after processing for security reasons
                setSearchParams((params) => {
                    params.delete('token')
                    return params
                })
            } catch (error) {
                console.error('Error handling invitation token:', error)
                // showBoundary(error)
            }
        }

        handleInvitationToken()
    }, [token, isLoaded, signUp, setSearchParams, showBoundary])

    // Google OAuth Signup Handler
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
                redirectUrlComplete: `${window.location.origin}/ws/`
            })
        } catch (error) {
            showBoundary(error)
            throw error
        } finally {
            setLoadingProvider(null)
        }
    }

    // GitHub OAuth Signup Handler
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
