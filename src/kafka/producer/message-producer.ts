const {Kafka} = require('kafkajs') ;

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

// export { kafkaProducer, kafkaConsumer }


// Publish message to Kafka topic
async function publishMessage(topic, message) {
    try {
        await kafkaProducer.send({
            topic: topic,
            messages: [{ value: message }],
          });
    } catch (error) {
        console.log('error', 'something went wrong while subscribing message' )
    }
  }

async function consumeMessage(topic) {
    try {
        await kafkaConsumer.subscribe({topic});
        await kafkaConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
              console.log('Last message:', message.value.toString());
              // Stop consuming messages after receiving the last one
              await kafkaConsumer.stop();
            },
          });

    } catch (error) {
        console.log('error', 'something went wrong while consuming message' )
    }
  }



  publishMessage('sample','hi');
  consumeMessage('sample')
