import { motion } from 'motion/react'
import { type FC } from 'react'
import Navigation from './marketing/home/navigation'
import HeroSection from './marketing/home/hero-section'
import FeaturesGrid from './marketing/home/features-grid'
import IntegrationsSection from './marketing/home/integrations-section'

// import AuroraBackground from '@/components/shared/aurora-background'

const Home: FC = () => {
    return (
        <div className="min-h-screen bg-background overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <Navigation />
            </motion.div>

            <main>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}>
                    <HeroSection />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}>
                    <FeaturesGrid />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}>
                    <IntegrationsSection />
                </motion.div>
            </main>
            {/* <Footer /> */}
        </div>
    )
}

export default Home
