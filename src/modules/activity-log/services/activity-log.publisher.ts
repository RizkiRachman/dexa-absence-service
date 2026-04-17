import {publish, QUEUES} from '@/lib/rabbitmq';
import {ActivityLogRequest} from '@/modules/activity-log/dtos/activity-log.dto';

export async function publishActivityLog(request: ActivityLogRequest): Promise<void> {
    await publish(QUEUES.ACTIVITY_LOG, request);
}