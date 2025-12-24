import { emailQueue } from './src/lib/queue';
import './src/lib/worker';

async function testQueue() {
    console.log('Adding test job to queue...');
    await emailQueue.add('html', {
        type: 'html',
        payload: {
            email: 'test@example.com',
            html: '<h1>Test</h1>',
            text: 'Test content',
        },
    });
    console.log('Job added. Check worker logs.');
}

testQueue().catch(console.error);
