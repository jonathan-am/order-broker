import amqp from "amqplib";
import logger from "~/config/logger";
import { processOrder } from "~/services/order.service";

export default async function initConsumer(){
    logger.warn('Conectando consumer a fila - order.queue')
    try {
        const conn = await amqp.connect("amqp://guest:guest@localhost:5672")
        const channel = await conn.createChannel();
        await channel.assertQueue('order.queue', { deadLetterExchange: 'order.exchange.dlq', deadLetterRoutingKey: 'orderDlqRouteKey'})
        await channel.prefetch(100)
        await channel.consume('order.queue', async (value) => {
            try {
                const order = JSON.parse(value.content.toString());
                logger.info('orderQueue.consumer - Mensagem recebida:', order);
                await processOrder(order);
                channel.ack(value, false);
            }catch(error) {
                logger.error('orderQueue.consumer - Erro ao processar o pedido, order:', order)
                channel.nack(value, false, false);
            }
        })
        logger.info('Consumer conectado na fila - order.queue')
    }catch(error) {
        logger.error('Erro ao conectar o consumer na fila - order.queue')
    }
}