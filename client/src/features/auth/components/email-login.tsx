import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'

import FormField from '@/components/shared/form-field'
import { Button } from '@/components/ui/button'
import { loginSchema } from '@/shared/schema/auth-schema'

import type { LoginFormRequest } from '../types/auth'

interface EmailLoginProps {
    setStep: (step: 'choose' | 'email' | 'code') => void
    startEmailSignIn: (data: LoginFormRequest) => Promise<void>
}

const EmailLogin: FC<EmailLoginProps> = ({ setStep, startEmailSignIn }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormRequest>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = handleSubmit(async (data: LoginFormRequest) => {
        await startEmailSignIn(data)
        setStep('code')
    })

    return (
        <div className="w-full flex flex-col items-center">
            <form
                onSubmit={onSubmit}
                className="w-full py-2 shadow rounded-lg">
                <FormField
                    label="Email"
                    name="email"
                    placeholder="Enter your email"
                    register={register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email address'
                        }
                    })}
                    errors={errors.email}
                    required
                />
                <FormField
                    label="Password"
                    name="password"
                    placeholder="*********"
                    register={register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long'
                        }
                    })}
                    errors={errors.password}
                    required
                />
                <Button
                    type="submit"
                    className="w-full">
                    Login
                </Button>
            </form>
        </div>
    )
}

export default EmailLogin
