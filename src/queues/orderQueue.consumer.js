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
            const data = JSON.parse(value.content.toString());
            try {
                logger.info('orderQueue.consumer - Mensagem recebida:', data.order);
                await processOrder(data.order);
                channel.ack(value, false);
            }catch(error) {
                logger.error('orderQueue.consumer - Erro ao processar o pedido, order:', order)
                data.error.push(error.message);
                channel.nack(JSON.stringify({ order: data.order, error: data.error }), false, false);
            }
        })
        logger.info('Consumer conectado na fila - order.queue')
    }catch(error) {
        logger.error('Erro ao conectar o consumer na fila - order.queue')
    }
}