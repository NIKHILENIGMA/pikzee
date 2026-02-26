import { Queue } from 'bullmq'

import { redisConnection } from '../redis'

export const videoPublishQueue = new Queue('video-publish', {
    connection: redisConnection
})
