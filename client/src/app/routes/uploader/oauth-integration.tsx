import { type FC, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import client from '@/shared/lib/api-client'
import { SOCIAL_ACCOUNTS_API_BASE } from '@/shared/constants'

const OAuthIntegration: FC = () => {
    const navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const handleOAuthCallback = async (platform: string, code: string, state: string): Promise<boolean> => {
        const response = await client.get<{ success: boolean }>(`${SOCIAL_ACCOUNTS_API_BASE}/callback/${platform}?code=${code}&state=${state}`)
        return response.data.success
    }

    const oAuthCallback = useCallback(async () => {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const state = params.get('state')
        const error = params.get('error')
        const errorDescription = params.get('error_description')

        if (error) {
            setErrorMsg(errorDescription || 'OAuth error returned')
            // clean URL then show or redirect
            window.history.replaceState({}, document.title, window.location.pathname)
            return
        }

        if (!code || !state) {
            navigate('/')
            return
        }

        // Optional: compare to stored state (set when initiating the flow)
        const savedState = sessionStorage.getItem('oauth_state')
        if (savedState && savedState !== state) {
            console.error('OAuth state mismatch')
            navigate('/')
            return
        }

        try {
            // handleOAuthCallback should POST code/state to your backend,
            // and the backend must exchange the code for tokens and validate state.

            const success = await handleOAuthCallback('YOUTUBE', code, state)
            // // Remove sensitive query params from URL
            // window.history.replaceState({}, document.title, window.location.pathname)
            if (success) {
                navigate('/media-manager')
            } else {
                setErrorMsg('Failed to connect account')
                navigate('/')
            }
        } catch (err) {
            // console.error(err)
            setErrorMsg(`Unexpected error while connecting account: ${err instanceof Error ? err.message : 'Unknown error'}`)
            navigate('/')
        }
    }, [navigate])

    useEffect(() => {
        oAuthCallback()
    }, [oAuthCallback])

    if (errorMsg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center">
                    <h2 className="text-lg font-medium">Connection failed</h2>
                    <p className="text-sm text-foreground/60 mt-2">{errorMsg}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="flex flex-col items-center space-y-4">
                <div
                    role="status"
                    className="flex items-center space-x-4">
                    <svg
                        className="w-8 h-8 text-red-600 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                        />
                    </svg>
                    <span className="text-lg font-medium text-foreground/80">Connecting to YouTube...</span>
                </div>
                <p className="text-sm text-foreground/60 text-center">Please wait while we finalize your account connection.</p>
            </div>
        </div>
    )
}

export default OAuthIntegration
