import { type FC, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const Plan: FC = () => {
    const [isYearly, setIsYearly] = useState(false)

    const plans = [
        {
            name: 'Free',
            monthly: 0,
            yearly: 0,
            badge: 'Ideal for testing',
            features: ['Single user', 'Basic analytics', 'Community support'],
            variant: 'outline',
            cardClass: 'border rounded-lg p-6 shadow-sm bg-card',
            buttonVariant: 'outline'
        },
        {
            name: 'Pro',
            monthly: 12,
            yearly: 120,
            badge: 'Most popular',
            features: ['Up to 5 users', 'Advanced analytics & integrations', 'Priority email support'],
            variant: 'highlight',
            cardClass: 'border-2 border-primary rounded-lg p-6 shadow-md bg-card',
            buttonVariant: 'default'
        },
        {
            name: 'Enterprise',
            monthly: 49,
            yearly: 490,
            badge: 'Enterprise',
            features: ['Unlimited users', 'Dedicated support & onboarding', 'SLA, SSO, advanced security'],
            variant: 'enterprise',
            cardClass: 'border rounded-lg p-6 shadow-sm bg-gradient-to-b from-secondary to-primary',
            buttonVariant: 'outline'
        }
    ]

    return (
        <div className="w-full mx-auto py-8 space-y-6">
            <header className="w-full flex flex-col items-center text-center">
                <h2 className="text-3xl font-semibold">Choose a plan</h2>
                <p className="text-base text-gray-500">Pricing shown monthly and yearly</p>

                <div className="mt-4 flex items-center gap-3">
                    <span className={isYearly ? 'text-foreground/50' : 'font-medium'}>Monthly</span>

                    <Switch
                        checked={isYearly}
                        onCheckedChange={(checked) => setIsYearly(Boolean(checked))}
                        aria-label="Toggle yearly pricing"
                    />

                    <span className={isYearly ? 'font-medium' : 'text-foreground/50'}>Yearly</span>
                </div>
            </header>

            <div className="flex h-full max-w-6xl mx-auto gap-6 text-foreground">
                {plans.map((plan) => {
                    const mainPrice = isYearly ? plan.yearly : plan.monthly
                    const mainSuffix = isYearly ? '/yr' : '/mo'
                    const altLine = isYearly ? `Monthly: $${(plan.yearly / 12).toFixed(2)} / mo` : `Yearly: $${plan.yearly} / yr`

                    return (
                        <section
                            key={plan.name}
                            className={`flex flex-col justify-between min-h-[40rem] md:w-1/3 ${plan.cardClass}`}>
                            <div>
                                <h3 className="text-xl font-medium">{plan.name}</h3>

                                <div className="mt-3 flex items-baseline justify-between">
                                    <div>
                                        <div className="text-3xl font-extrabold">
                                            ${mainPrice} <span className="text-sm font-medium text-foreground/50">{mainSuffix}</span>
                                        </div>
                                        <div className="text-sm text-foreground/50">{altLine}</div>
                                    </div>

                                    <span
                                        className={
                                            plan.variant === 'enterprise'
                                                ? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-foreground/10 text-foreground'
                                                : 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary'
                                        }>
                                        {plan.badge}
                                    </span>
                                </div>

                                <ul className="mt-4 space-y-2 text-base text-foreground">
                                    {plan.features.map((f) => (
                                        <li key={f}>• {f}</li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                variant={'default'}
                                className="mt-6 w-full">
                                {plan.name === 'Free' ? 'Get started (Free)' : plan.name === 'Pro' ? 'Upgrade to Pro' : 'Contact Sales'}
                            </Button>
                        </section>
                    )
                })}
            </div>
        </div>
    )
}

export default Plan
