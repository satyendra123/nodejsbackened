const amqp = require('amqplib/callback_api');

// Replace with your RabbitMQ connection URL
const rabbitmqUrl = 'amqp://localhost:5672/';

amqp.connect(rabbitmqUrl, (error0, connection) => {
    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        // The queue to consume messages from
        const queue = 'AmzAdminQueue';

        // Ensure the queue exists
        channel.assertQueue(queue, {
            durable: true // Messages will be persisted to disk
        });

        console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

        // Consume messages from the queue
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const messageContent = msg.content.toString();
                channel.ack(msg);
                console.log(`[x] Received: ${messageContent}`);
            }
        }, {
            noAck: false // Ensure that the message is acknowledged after processing
        });
    });
});
