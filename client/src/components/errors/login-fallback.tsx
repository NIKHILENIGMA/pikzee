import { type FC } from 'react'

import { Button } from '../ui/button'

interface LoginFallbackProps {
    error: Error
    resetError: () => void
}

const LoginFallback: FC<LoginFallbackProps> = ({ error, resetError }) => {
    let errorMessage = error.message
    if (error.message.includes(`Couldn't find your account`)) {
        errorMessage =
            "It seems your account doesn't exist. Please check your email and try again. If you don't have an account, you can sign up to get started."
    } else if (error.message.includes('Invalid code')) {
        errorMessage = 'The code you entered is invalid. Please try again.'
    } else if (error.message.includes('Password has been found in an online data breach')) {
        errorMessage = 'The password has been compromised. Please reset your password.'
    }

    const handleSignup = () => {
        resetError()
        // Navigate to signup page
        window.location.href = '/auth/signup'
    }
    return (
        <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
            <p className="text-center text-lg font-medium">{errorMessage}</p>
            <Button
                variant={'ghost'}
                onClick={handleSignup}
                className="w-full">
                Signup
            </Button>
        </div>
    )
}

export default LoginFallback
