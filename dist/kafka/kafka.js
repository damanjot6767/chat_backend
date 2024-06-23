"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaConsumer = exports.kafkaProducer = void 0;
const kafkajs_1 = require("kafkajs");
const kafkaInstance = new kafkajs_1.Kafka({
    clientId: 'chat-app',
    brokers: ['localhost:9092'] // Kafka broker(s) configuration
});
const kafkaProducer = kafkaInstance.producer();
exports.kafkaProducer = kafkaProducer;
const kafkaConsumer = kafkaInstance.consumer({ groupId: 'my-group' });
exports.kafkaConsumer = kafkaConsumer;
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield kafkaProducer.connect();
        yield kafkaConsumer.connect();
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield connect();
}))();
