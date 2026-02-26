import { Queue } from 'bullmq'

import { redisConnection } from '../../config/redis'

export const videoPublishQueue = new Queue('video-publish', {
    connection: redisConnection
})
