import { Queue } from 'bullmq';
import redisConnection from './redis';

export const emailQueue = new Queue('emailQueue', {
    connection: redisConnection,
});

emailQueue.on('error', (err) => {
    console.error('Queue error:', err);
});

emailQueue.on('waiting', (job) => {
    const jobId = typeof job === 'object' ? job.id : job;
    console.log(`Job ${jobId} is waiting...`);
});
