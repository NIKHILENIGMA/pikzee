import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { useState, type FC } from 'react'

import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

import { useSignup } from '../hooks/use-signup'

interface SignupVerificationCodeProps {
    setStep: (step: 'initial' | 'email' | 'code') => void
}

const SignupVerificationCode: FC<SignupVerificationCodeProps> = ({ setStep }) => {
    const [code, setCode] = useState<string>('')
    const [errorMsg, setErrorMsg] = useState<string>('')

    const { emailSendAddress, handleCodeChange, handleCodeVerification } = useSignup()

    return (
        <div className="flex flex-col space-y-4">
            <p className="text-center">A verification code has been sent to {emailSendAddress}. Please enter it below to verify your account.</p>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleCodeVerification(code, setStep, setErrorMsg)
                }}
                className="w-full py-2 shadow rounded-lg flex flex-col space-y-2 items-center">
                <InputOTP
                    value={code}
                    onChange={(value) => handleCodeChange(value, setCode, setErrorMsg)}
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                <Button
                    variant={'default'}
                    type="submit"
                    disabled={code.length !== 6}
                    className="w-1/2">
                    Verify
                </Button>
                <Button
                    variant={'secondary'}
                    type="button"
                    disabled={code.length !== 6}
                    className="w-1/2">
                    Resend Code
                </Button>
            </form>
        </div>
    )
}

export default SignupVerificationCode
