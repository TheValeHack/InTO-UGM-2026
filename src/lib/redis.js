import Redis from 'ioredis';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
});

redisConnection.on('connect', () => {
    console.log('Redis connected');
});

redisConnection.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redisConnection.on('reconnecting', () => {
    console.log('Redis reconnecting...');
});

redisConnection.on('ready', () => {
    console.log('Redis ready');
});

export default redisConnection;
