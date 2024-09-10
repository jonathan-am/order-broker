const { default: logger } = require("./config/logger");
const { default: initConsumer } = require("./queues/orderQueue.consumer");
import { startRedis } from "./config/redis.config";

const initApp = async () => {
    logger.info('[Order-Broker] Inicializando aplicação.'),
    await initConsumer(),
    await startRedis(),
    logger.info('[Order-Broker] Applicação inicializada.')
}

initApp();