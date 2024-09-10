import logger from "./config/logger";
import initConsumer from "./queues/orderQueue.consumer";
import { startRedis } from "./config/redis.config";

const initApp = async () => {
    logger.info('[Order-Broker] Inicializando aplicação.'),
    await initConsumer(),
    await startRedis(),
    logger.info('[Order-Broker] Applicação inicializada.')
}

initApp();