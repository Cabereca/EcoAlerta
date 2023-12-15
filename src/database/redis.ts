import { createClient } from 'redis';

const redisClient = createClient();

async function conectar(): Promise<void> {
    redisClient.on('error', err => { console.log('Redis Client Error', err); });
    await redisClient.connect();
    console.log('Conectado com o Redis');
}

void conectar();

export default redisClient