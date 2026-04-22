import { motion } from 'motion/react'
import { Card } from '@/components/ui/card'
import { Zap, Shield, Sparkles, Share2 } from 'lucide-react'

const features = [
    {
        icon: Shield,
        title: 'Digital Asset Management (DAM)',
        subtitle: 'Your Central Source of Truth',
        description:
            'Securely store and organize your media in a unified vault. Centralized storage, lightning-fast search, folder organization, and instant transformations.',
        color: 'from-blue-500/20 to-blue-500/10'
    },
    {
        icon: Zap,
        title: 'WYSIWYG Block Editor',
        subtitle: 'Notion-Style Content Authoring',
        description:
            'Rich, block-based editor powered by Tiptap for scripts, captions, and articles. Focus on writing with a distraction-free, slash-command interface.',
        color: 'from-purple-500/20 to-purple-500/10'
    },
    {
        icon: Sparkles,
        title: 'Magic Image Editor',
        subtitle: 'AI-Powered Media Magic',
        description:
            'AI-driven transformations like smart-crop, background removal, format repurposing, and one-click resizing for different social platforms.',
        color: 'from-pink-500/20 to-pink-500/10'
    },
    {
        icon: Share2,
        title: 'Smart Publish',
        subtitle: 'One-Click Multichannel Publishing',
        description:
            'Integrations with YouTube, X/Twitter, LinkedIn, and more. Media Scheduler and automated job queues for hassle-free delivery.',
        color: 'from-orange-500/20 to-orange-500/10'
    }
]

export default function FeaturesGrid() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                    ease: 'easeOut' as const
            }
        }
    }

    return (
        <section
            id="features"
            className="relative bg-white px-4 py-12 dark:bg-zinc-950 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 space-y-4 text-center sm:mb-16">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
                        Powerful Features,{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Simplified
                        </span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
                        Everything creators need to manage, edit, and publish content at scale
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div key={index} variants={cardVariants}>
                                <Card className="group relative overflow-hidden border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-blue-400 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500/50 sm:p-8">
                                    {/* Background glow on hover */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                                    />

                                    <div className="relative z-10 space-y-4">
                                        {/* Icon */}
                                        <div className="inline-flex rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 dark:from-blue-500/10 dark:to-purple-500/10">
                                            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                {feature.subtitle}
                                            </p>
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">
                                                {feature.title}
                                            </h3>
                                        </div>

                                        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
                                            {feature.description}
                                        </p>

                                        {/* Link */}
                                        <div className="pt-2">
                                            <a
                                                href="#"
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                                Learn more
                                                <span className="transition-transform group-hover:translate-x-1">
                                                    →
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
