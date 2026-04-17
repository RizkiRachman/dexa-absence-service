import amqplib, { Channel, ChannelModel } from 'amqplib';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

// All event queues used in this app
export const QUEUES = {
  ABSENCE_SUBMITTED: 'absence.submitted',
  ABSENCE_STATUS_UPDATED: 'absence.status.updated',
  EMPLOYEE_INFO_UPDATED: 'employee.info.updated',
  EMPLOYEE_CREATED: 'employee.created',
  ACTIVITY_LOG: 'activity.log',
} as const;

/**
 * Get (or create) a shared RabbitMQ channel.
 * Connects once and reuses the connection.
 */
async function getChannel(): Promise<Channel> {
  if (channel) return channel;

  connection = await amqplib.connect(process.env.RABBITMQ_URL!);
  channel = await (connection as ChannelModel).createChannel();

  // Make sure all queues exist (creates them if they don't)
  for (const queue of Object.values(QUEUES)) {
    await channel!.assertQueue(queue, { durable: true }); // durable = survives restarts
  }

  return channel!;
}

export async function publish(queue: string, data: object): Promise<void> {
  try {
    const ch = await getChannel();
    ch.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(data)),
      { persistent: true } // message survives RabbitMQ restart
    );
    console.log(`[RabbitMQ] Published to "${queue}":`, data);
  } catch (err) {
    // Don't crash the API if RabbitMQ is temporarily unavailable
    console.error(`[RabbitMQ] Failed to publish to "${queue}":`, err);
  }
}
