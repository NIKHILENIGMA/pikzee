import { useSignIn, useSignUp } from '@clerk/clerk-react'
import { useEffect, type FC } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router'

const SSOCallback: FC = () => {
    const { isLoaded: signUpLoaded, signUp } = useSignUp()
    const { isLoaded: signInLoaded, signIn } = useSignIn()
    const navigate = useNavigate()
    const { showBoundary } = useErrorBoundary()

    useEffect(() => {
        if (!signUpLoaded || !signInLoaded) return

        const complete = async () => {
            try {
                // Clerk figures out if this is a signUp or signIn flow
                if (signUp.status === 'complete' || signIn.status === 'complete') {
                    navigate('/dashboard') // 👈 your final redirect
                }
            } catch (err) {
                // console.error('OAuth completion error:', err)
                showBoundary(err as Error)
                navigate('/auth/sign-up') // fallback if something failed
            }
        }

        complete()
    }, [signUpLoaded, signInLoaded, signUp, signIn, navigate, showBoundary])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Signing you in with SSO...</h2>
            <p className="text-gray-600">Please wait while we complete your authentication.</p>
        </div>
    )
}

export default SSOCallback
