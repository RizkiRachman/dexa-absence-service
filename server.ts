import {createServer} from 'http';
import {parse} from 'url';
import next from 'next';
import {startConsumers} from '@/modules/activity-log/queue/queue.service';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({dev});
const handle = app.getRequestHandler(); // Next.js request handler

app.prepare().then(async () => {
    // Create a plain HTTP server
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl); // pass all requests to Next.js
    });

    // Start RabbitMQ consumers (listens to all 4 queues)
    await startConsumers();

    httpServer.listen(port, () => {
        console.log(`> Server running at http://localhost:${port}`);
        console.log(`> WebSocket ready at ws://localhost:${port}/api/notifications/ws`);
    });
});
