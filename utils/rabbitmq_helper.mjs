import dotenv from 'dotenv'
import amqp from 'amqplib/callback_api.js';

dotenv.config()





const sendToQueue = (queue, message) => {
    const rabbitmqURL = process.env.RABBITMQ_URL;
    amqp.connect(rabbitmqURL, (error0, connection) => {
      if (error0) {
        console.error("RabbitMQ connection error:", error0);
        return;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          console.error("RabbitMQ channel error:", error1);
          return;
        }
  
        channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log("Sent message to queue:", message);
      });
  
      setTimeout(() => connection.close(), 500);
    });
  }

  export default sendToQueue