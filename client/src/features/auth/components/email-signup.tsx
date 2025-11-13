import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components'
import { Button } from '@/components/ui/button'
import { signupSchema } from '@/shared/schema/auth-schema'

import { useSignup } from '../hooks/use-signup'
import type { SignupFormRequest } from '../types/auth'

interface EmailSignupProps {
    setStep: (step: 'initial' | 'email' | 'code') => void
}

const EmailSignup = ({ setStep }: EmailSignupProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        clearErrors,
        reset
    } = useForm<SignupFormRequest>({
        resolver: zodResolver(signupSchema),
        mode: 'onBlur',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }
    })

    const { onSubmit } = useSignup()

    return (
        <div className="flex flex-col space-y-4">
            <form
                onSubmit={handleSubmit((data) => onSubmit(data, clearErrors, reset, setStep))}
                className="w-full py-2 shadow rounded-lg">
                <div className="flex space-x-2">
                    <FormField
                        label="First Name"
                        name="firstName"
                        placeholder="First Name"
                        register={register('firstName')}
                        required={true}
                        errors={errors.firstName}
                    />
                    <FormField
                        label="Last Name"
                        name="lastName"
                        placeholder="Last Name"
                        register={register('lastName')}
                        required={true}
                        errors={errors.lastName}
                    />
                </div>
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    register={register('email')}
                    required={true}
                    errors={errors.email}
                />
                <FormField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="*********"
                    register={register('password')}
                    required={true}
                    errors={errors.password}
                />
                <div id="clerk-captcha"></div>
                <div className="flex flex-col space-y-2 mt-4">
                    <Button
                        variant={'default'}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full">
                        {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </Button>
                    <Button
                        variant={'secondary'}
                        type="submit"
                        className="w-full"
                        onClick={() => {
                            setStep('initial')
                        }}>
                        Go Back
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default EmailSignup
