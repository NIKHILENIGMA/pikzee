import { Platforms, smartPublishService } from '@/modules/smart-publish'
import { Worker } from 'bullmq'
import { redisConnection } from '../redis'
import { logger } from '@/config';

const worker = new Worker(
    'video-publish',
    async (job: { data: { videoPostId: string; platform: Platforms } }) => {
        const { videoPostId, platform } = job.data

        await smartPublishService.processVideoPublish(videoPostId, platform)

        return true
    },
    { connection: redisConnection }
)

worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`)
})
