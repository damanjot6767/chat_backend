"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = exports.redisPublishInstance = exports.redisSubscriberInstance = exports.redisInstance = void 0;
const ioredis_1 = require("ioredis");
Object.defineProperty(exports, "Redis", { enumerable: true, get: function () { return ioredis_1.Redis; } });
let redisInstance = null;
exports.redisInstance = redisInstance;
let redisSubscriberInstance = null;
exports.redisSubscriberInstance = redisSubscriberInstance;
let redisPublishInstance = null;
exports.redisPublishInstance = redisPublishInstance;
// Ensure redisInstance is initialized only once
if (!redisInstance) {
    exports.redisInstance = redisInstance = new ioredis_1.Redis(process.env.REDIS_URL);
    // Event listener for the first connection
    redisInstance.once("connect", () => {
        console.log("Connected to Redis");
    });
    // Event listener for errors
    redisInstance.on("error", (err) => {
        console.error("Error connecting to Redis:", err);
        // Handle specific errors like ECONNRESET here
        if (err.code === 'ECONNRESET') {
            // Attempt reconnection or other recovery logic
            console.log("Attempting to reconnect to Redis...");
            redisInstance.connect(); // Attempt to reconnect
        }
        // Optionally exit process or handle other errors
        // process.exit(1);
    });
}
//Ensure redisSubscriber instance in intialized only once 
if (!redisSubscriberInstance) {
    exports.redisSubscriberInstance = redisSubscriberInstance = new ioredis_1.Redis(process.env.REDIS_URL);
    // Event listener for the first connection
    redisSubscriberInstance.once("connect", () => {
        console.log("Connected to Redis subscriber");
    });
    // Event listener for errors
    redisSubscriberInstance.on("error", (err) => {
        console.error("Error connecting to Redis:", err);
        // Handle specific errors like ECONNRESET here
        if (err.code === 'ECONNRESET') {
            // Attempt reconnection or other recovery logic
            console.log("Attempting to reconnect to Redis...");
            redisSubscriberInstance.connect(); // Attempt to reconnect
        }
        // Optionally exit process or handle other errors
        // process.exit(1);
    });
}
//Ensure redisPublisher instance in intialized only once 
if (!redisPublishInstance) {
    exports.redisPublishInstance = redisPublishInstance = new ioredis_1.Redis(process.env.REDIS_URL);
    // Event listener for the first connection
    redisPublishInstance.once("connect", () => {
        console.log("Connected to Redis publisher");
    });
    // Event listener for errors
    redisPublishInstance.on("error", (err) => {
        console.error("Error connecting to Redis:", err);
        // Handle specific errors like ECONNRESET here
        if (err.code === 'ECONNRESET') {
            // Attempt reconnection or other recovery logic
            console.log("Attempting to reconnect to Redis...");
            redisPublishInstance.connect(); // Attempt to reconnect
        }
        // Optionally exit process or handle other errors
        // process.exit(1);
    });
}
