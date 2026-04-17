import amqplib from 'amqplib';
import {QUEUES} from '@/lib/rabbitmq';
import {ActivityLogRequest} from '@/modules/activity-log/dtos/activity-log.dto';
import {activityLogService} from "@/modules/activity-log/services/activity-log.service";

export async function startActivityLogConsumer(): Promise<void> {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUES.ACTIVITY_LOG, {durable: true});
    await channel.prefetch(1); // process one message at a time

    console.log(`[Consumer] Listening on "${QUEUES.ACTIVITY_LOG}"`);

    await channel.consume(QUEUES.ACTIVITY_LOG, async (msg) => {
        if (!msg) return;

        try {
            const request = JSON.parse(msg.content.toString()) as ActivityLogRequest;
            await activityLogService.insertActivityLog(request);
            channel.ack(msg);
        } catch (err) {
            console.error('[Consumer] Failed to process activity log:', err);
            channel.nack(msg, false, false);
        }
    });
}