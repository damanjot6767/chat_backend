var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Kafka } = require('kafkajs');
const kafkaInstance = new Kafka({
    clientId: 'chat-app',
    brokers: ['localhost:9092'] // Kafka broker(s) configuration
});
const kafkaProducer = kafkaInstance.producer();
const kafkaConsumer = kafkaInstance.consumer({ groupId: 'my-group' });
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield kafkaProducer.connect();
        yield kafkaConsumer.connect();
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield connect();
}))();
// export { kafkaProducer, kafkaConsumer }
// Publish message to Kafka topic
function publishMessage(topic, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield kafkaProducer.send({
                topic: topic,
                messages: [{ value: message }],
            });
        }
        catch (error) {
            console.log('error', 'something went wrong while subscribing message');
        }
    });
}
function consumeMessage(topic) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield kafkaConsumer.subscribe({ topic });
            yield kafkaConsumer.run({
                eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                    console.log('Last message:', message.value.toString());
                    // Stop consuming messages after receiving the last one
                    yield kafkaConsumer.stop();
                }),
            });
        }
        catch (error) {
            console.log('error', 'something went wrong while consuming message');
        }
    });
}
publishMessage('sample', 'hi');
consumeMessage('sample');
