import { useSignIn } from '@clerk/clerk-react'
import { useErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import type { LoginFormRequest } from '../types/auth'

export function useEmailAuth() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const { showBoundary } = useErrorBoundary()
    const navigate = useNavigate()

    const startEmailSignIn = async (data: LoginFormRequest): Promise<void> => {
        if (!isLoaded) return
        try {
            const signInAttempt = await signIn.create({
                strategy: 'password',
                identifier: data.email,
                password: data.password
            })
            if (signInAttempt.status !== 'complete') {
                showBoundary(new Error('Sign-in attempt failed, please try again.'))
                return
            } else if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                toast.success('Welcome back! You have successfully logged in.')
                navigate('/dashboard')
            }

            toast('Verification code sent to your email', {
                description: 'Please check your inbox for the code.',
                action: { label: 'Dismiss', onClick: () => toast.dismiss() }
            })
        } catch (error) {
            showBoundary(error)
            toast.error('Failed to login. Please try again.')
        }
    }

    return { startEmailSignIn }
}
