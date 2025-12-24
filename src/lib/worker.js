import { Worker } from 'bullmq';
import redisConnection from './redis';
import { sendVerificationEmail, sendHtmlEmail } from './mailer';
import { appendToSheet } from './googleSheets';

const worker = new Worker(
    'emailQueue',
    async (job) => {
        const { type, payload } = job.data;

        try {
            if (type === 'verification') {
                await sendVerificationEmail(payload.email, payload.token);
            } else if (type === 'html') {
                await sendHtmlEmail(payload.email, payload.html, payload.text);
            } else if (type === 'sheet') {
                await appendToSheet(payload.sheetName, payload.values);
            }
            console.log(`Job ${job.id} processed successfully`);
        } catch (error) {
            console.error(`Failed to process job ${job.id}:`, error);
            throw error;
        }
    },
    { connection: redisConnection }
);

worker.on('active', (job) => {
    console.log(`Job ${job.id} of type ${job.data.type} started processing`);
});

worker.on('completed', (job) => {
    console.log(`Job ${job.id} of type ${job.data.type} has completed`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} of type ${job.data.type} failed with error: ${err.message}`);
});

worker.on('progress', (job, progress) => {
    console.log(`Job ${job.id} is ${progress}% complete`);
});

worker.on('error', (err) => {
    console.error('Worker error:', err);
});

export default worker;
