import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { FormField } from '@/components'
import { Button } from '@/components/ui/button'
import { loginSchema } from '@/shared/schema/auth-schema'

import { useLogin } from '../hooks/use-login'
import type { LoginFormRequest } from '../types/auth'

import ChooseOptions from './choose-options'

type LoginStep = 'initial' | 'email'

const LoginForm: FC = () => {
    const [step, setStep] = useState<LoginStep>('initial')
    const { onSubmit, handleGoogleLogin, handleGithubLogin, loadingProvider, formError } = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormRequest>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    return (
        <div className="relative w-full max-w-md p-6 flex flex-col z-50">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-semibold">Log in with your account</h1>
            </div>

            <div className="flex flex-col gap-4">
                {step == 'initial' ? (
                    <ChooseOptions
                        googleText="Login in with Google"
                        githubText="Login in with GitHub"
                        emailBtnText="Login in with Email"
                        onStepChange={setStep}
                        isLoading={loadingProvider}
                        onGoogleAuth={() => handleGoogleLogin('oauth_google')}
                        onGithubAuth={() => handleGithubLogin('oauth_github')}
                    />
                ) : step == 'email' ? (
                    <div className="w-full flex items-center justify-center">
                        <form
                            className="w-full max-w-sm"
                            onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-4">
                                <FormField
                                    name="email"
                                    type="email"
                                    label="Email address"
                                    placeholder="johndoe@example.com"
                                    register={register('email')}
                                    required={true}
                                    errors={errors.email}
                                />
                                <FormField
                                    name="password"
                                    type="password"
                                    label="Password"
                                    placeholder="**********"
                                    register={register('password')}
                                    required={true}
                                    errors={errors.password}
                                />
                                <Button
                                    type="submit"
                                    className="w-full">
                                    Login
                                </Button>
                                {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
                            </div>
                        </form>
                    </div>
                ) : null}
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
                Don’t have an account yet?{' '}
                <Link
                    to="/auth/signup"
                    className="text-primary">
                    Sign up
                </Link>
            </div>
        </div>
    )
}

export default LoginForm
