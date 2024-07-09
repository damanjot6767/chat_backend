import { Kafka } from 'kafkajs';
import fs from 'fs';
import path from 'path';

const caCertPath = path.resolve(__dirname, './ca.pem');

// Kafka setup
const kafkaInstance = new Kafka({
  brokers: [process.env.KAFKA_URL],
  ssl: {
    ca: [fs.readFileSync(caCertPath, 'utf-8')],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
    mechanism: 'plain',
  },
  connectionTimeout: 3000,
  authenticationTimeout: 3000,
  retry: {
    retries: 8, // Increase the number of retries
    factor: 0.2, // Factor to multiply the backoff
  },
});

const producer = kafkaInstance.producer();
const consumer = kafkaInstance.consumer({ groupId: 'chat-group' });

const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    console.log('Kafka connected');
  } catch (error) {
    console.error('Error connecting Kafka:', error);
  }
};

const produceMessage = async ({ topic, data }: { topic: string; data: any }) => {
  const res = await producer.send({ topic, messages: [{ value: JSON.stringify(data) }] });
  console.log('Produced message to Kafka', res);
};

const consumeMessages = async ({ topic, callBack }: { topic: string; callBack: Function }) => {
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await callBack(JSON.parse(message.value.toString()).data);
    },
  });
};

export { connectKafka, produceMessage, consumeMessages };
