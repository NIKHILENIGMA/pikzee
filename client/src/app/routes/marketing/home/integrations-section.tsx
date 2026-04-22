import { motion } from 'motion/react'
import { Card } from '@/components/ui/card'

const integrations = [
    { name: 'YouTube', icon: '▶️' },
    { name: 'LinkedIn', icon: '💼' },
    { name: 'X/Twitter', icon: '𝕏' },
    { name: 'Instagram', icon: '📷' },
    { name: 'TikTok', icon: '🎵' },
    { name: 'Facebook', icon: '👥' }
]

export default function IntegrationsSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                        type: 'spring' as const,
                stiffness: 100,
                damping: 15
            }
        }
    }

    return (
        <section
            id="integrations"
            className="relative bg-gradient-to-b from-white to-zinc-50 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 space-y-4 text-center sm:mb-16">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
                        Connect Your Entire Stack
                    </h2>
                    <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
                        Publish to all your favorite platforms with a single click
                    </p>
                </motion.div>

                {/* Integration Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
                    {integrations.map((integration, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="group relative flex flex-col items-center justify-center gap-3 border border-zinc-200 bg-white p-4 transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500/50 sm:p-6">
                                <div className="text-3xl transition-transform duration-300 group-hover:scale-125 sm:text-4xl">
                                    {integration.icon}
                                </div>
                                <span className="text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 sm:text-sm">
                                    {integration.name}
                                </span>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center sm:mt-16">
                    <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 sm:mb-6">
                        More integrations coming soon
                    </p>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 dark:bg-blue-600 dark:hover:bg-blue-700 sm:text-base">
                        Browse All Integrations
                        <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}>
                            →
                        </motion.span>
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
