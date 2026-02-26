import 'tsconfig-paths/register'
import { logger } from '@/config'
import { worker } from './video-publish.worker'

logger.info('Workers started successfully')

worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`)
})


