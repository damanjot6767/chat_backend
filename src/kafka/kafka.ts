import {Kafka} from 'kafkajs';

const kafkaInstance = new Kafka({
    clientId: 'chat-app',
    brokers: ['localhost:9092'] // Kafka broker(s) configuration
  });

const kafkaProducer = kafkaInstance.producer();

const kafkaConsumer = kafkaInstance.consumer({ groupId: 'my-group' });

async function connect() {
  await kafkaProducer.connect();
  await kafkaConsumer.connect();
}

(async () => {
  await connect();
})();

export { kafkaProducer, kafkaConsumer }