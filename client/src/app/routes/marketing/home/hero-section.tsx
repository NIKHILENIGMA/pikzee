import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function HeroSection() {
    const navigate = useNavigate()

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-zinc-50 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* Left Content */}
                    <motion.div
                        className="space-y-6 sm:space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}>
                        <div className="space-y-4">
                            <motion.h1
                                variants={itemVariants}
                                className="text-4xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-7xl">
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Content Creation,
                                </span>
                                <br />
                                Supercharged by AI.
                            </motion.h1>
                            <motion.p
                                variants={itemVariants}
                                className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl lg:text-2xl leading-relaxed">
                                The all-in-one workspace for creators. Manage assets, edit with AI, and
                                publish to every platform in one click.
                            </motion.p>
                        </div>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <Button
                                size="lg"
                                variant="default"
                                className="w-full text-base sm:w-auto"
                                onClick={() => navigate('/auth/login')}>
                                Start Creating for Free
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full gap-2 border-zinc-300 text-base dark:border-zinc-700 sm:w-auto">
                                <Play className="h-4 w-4" />
                                Watch Demo
                            </Button>
                        </motion.div>

                        {/* Trust Badge */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-3">
                            <div className="flex gap-1 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Trusted by 10,000+ creators worldwide
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                        className="perspective-1000 relative h-72 sm:h-96 lg:h-[500px]">
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            className="relative h-full w-full overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800">
                            <img
                                src="/dashboard-mockup.jpg"
                                alt="Pikzee Dashboard"
                                className="h-full w-full object-cover"
                            />
                            {/* Overlay glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent opacity-30" />
                        </motion.div>

                        {/* Floating elements for "cool" effect */}
                        <motion.div
                            animate={{
                                y: [0, 20, 0],
                                x: [0, 10, 0]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -right-6 -top-6 h-24 w-24 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hidden sm:block"
                        />
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                x: [0, -10, 0]
                            }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl hidden sm:block"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Decorative background elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-500/5"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px] dark:bg-purple-500/5"
            />
        </section>
    )
}
