import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

const NotFound: FC = () => {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
            <section className="bg-card rounded-xl shadow-lg p-8 flex flex-col items-center text-foreground gap-4">
                <svg
                    className="w-20 h-20 text-red-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle
                        cx="24"
                        cy="24"
                        r="22"
                        strokeWidth="4"
                    />
                    <path
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 32L32 16M32 32L16 16"
                    />
                </svg>
                <h1 className="text-4xl font-bold ">404</h1>
                <p className="text-lg text-foreground/80">Page Not Found</p>
                <div className="flex gap-3 mt-2">
                    <Button
                        onClick={() => navigate('/')}
                        variant={'default'}>
                        Go Home
                    </Button>
                    <Button
                        type="button"
                        onClick={handleGoBack}
                        variant={'secondary'}>
                        Go Back
                    </Button>
                </div>
            </section>
        </main>
    )
}

export default NotFound
