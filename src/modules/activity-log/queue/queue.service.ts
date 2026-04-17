import {startActivityLogConsumer} from '@/modules/activity-log/services/activity-log.consumer';

export async function startConsumers(): Promise<void> {
    await startActivityLogConsumer();
    console.log('[RabbitMQ] All consumers started');
}
