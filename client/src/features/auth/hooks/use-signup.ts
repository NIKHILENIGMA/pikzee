import { useSignUp } from '@clerk/clerk-react'
import { useCallback, useEffect } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { useNavigate, useParams } from 'react-router'

import type { SignupFormRequest } from '../types/auth'

export const useSignup = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const { showBoundary } = useErrorBoundary()
    const navigate = useNavigate()

    const { token } = useParams<{ token?: string }>()

    // Inject token into unsafeMetadata if it exists in URL params
    const injectToken = useCallback(async () => {
        if (!isLoaded) return
        await signUp.update({ unsafeMetadata: { token } })
    }, [signUp, token, isLoaded])

    useEffect(() => {
        if (isLoaded && token) {
            injectToken()
        }
    }, [isLoaded, token])

    const onSubmit = async (
        data: SignupFormRequest,
        clearErrors: () => void,
        reset: () => void,
        setStep: (step: 'initial' | 'email' | 'code') => void
    ) => {
        clearErrors()
        try {
            if (!isLoaded) return
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                unsafeMetadata: {
                    token: data.token
                }
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setStep('code')
            reset() // Clear form fields after successful submission
        } catch (error) {
            showBoundary(error)
        }
    }

    const handleCodeChange = (value: string, onCodeChange: (value: string) => void, onError: (error: string) => void) => {
        // If value contains only numbers, update code and clear error
        // Only allow numbers, no regex
        const isOnlyNumbers = value.split('').every((char) => char >= '0' && char <= '9')
        if (isOnlyNumbers) {
            onCodeChange(value)
            onError('')
        } else {
            onError('Only numbers are allowed')
        }
    }

    const handleCodeVerification = async (
        code: string,
        onStepChange: (step: 'initial' | 'email' | 'code') => void,
        onError: (error: string) => void
    ) => {
        if (!isLoaded) return
        if (code.length !== 6) {
            showBoundary(new Error('Please enter a valid 6-digit code.'))
            return
        }
        try {
            const completeSignup = await signUp.attemptEmailAddressVerification({ code })

            if (completeSignup.status !== 'complete') {
                showBoundary(new Error('Sign-up attempt failed, please try again.'))
            }

            if (completeSignup.status === 'complete') {
                await setActive({ session: completeSignup.createdSessionId })
            }
            navigate('/dashboard')
            onStepChange('initial')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Something went wrong during code verification.'
            onError(message)
        }
    }

    return {
        isLoaded,
        signUp,
        setActive,
        onSubmit,
        emailSendAddress: signUp?.emailAddress || '',
        handleCodeChange,
        handleCodeVerification
    }
}
