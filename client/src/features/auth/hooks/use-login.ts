import { useSignIn } from '@clerk/clerk-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import type { LoginFormRequest } from '../types/auth'

type OAuthProvider = 'oauth_google' | 'oauth_github'

export const useLogin = () => {
    const { isLoaded, signIn, setActive } = useSignIn()
    const navigate = useNavigate()
    const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)
    const [formError, setFormError] = useState<string | null>(null)

    const onSubmit = async (data: LoginFormRequest) => {
        if (!isLoaded) return

        try {
            const result = await signIn.create({
                identifier: data.email,
                password: data.password
            })

            if (result.status === 'complete' && result.createdSessionId) {
                await setActive({ session: result.createdSessionId })
                navigate('/ws')
            } else {
                setFormError('Login failed. Please try again.')
            }
        } catch (error) {
            setFormError(`Failed to login. Please try again. ${(error as Error).message}`)
        }
    }

    const handleGoogleLogin = async (oauthStrategy: OAuthProvider) => {
        if (oauthStrategy !== 'oauth_google') {
            return
        }
        if (!isLoaded) return

        setLoadingProvider(oauthStrategy)
        try {
            await signIn.authenticateWithRedirect({
                strategy: oauthStrategy,
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/ws/`
            })
        } catch (error) {
            setFormError(`Failed to login with Google. Please try again. ${(error as Error).message}`)
            throw error
        } finally {
            setLoadingProvider(null)
        }
    }

    const handleGithubLogin = async (oauthStrategy: OAuthProvider) => {
        if (oauthStrategy !== 'oauth_github') {
            return
        }

        if (!isLoaded) return

        setLoadingProvider(oauthStrategy)
        try {
            await signIn.authenticateWithRedirect({
                strategy: oauthStrategy,
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/ws/`
            })
        } catch (error) {
            setFormError(`Failed to login with GitHub. Please try again. ${(error as Error).message}`)
            throw error
        } finally {
            setLoadingProvider(null)
        }
    }

    return {
        onSubmit,
        handleGoogleLogin,
        handleGithubLogin,
        loadingProvider,
        formError,
        setFormError
    }
}
