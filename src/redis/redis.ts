import { Redis } from "ioredis";

let redisInstance: Redis | null = null;
let redisSubscriberInstance: Redis | null = null;

let redisPublishInstance: Redis | null = null;

// Ensure redisInstance is initialized only once
if (!redisInstance) {

  redisInstance = new Redis(process.env.REDIS_URL);

  // Event listener for the first connection
  redisInstance.once("connect", () => {
    console.log("Connected to Redis");
  });

  // Event listener for errors
  redisInstance.on("error", (err: any) => {
    console.error("Error connecting to Redis:", err);
    // Handle specific errors like ECONNRESET here
    if (err.code === 'ECONNRESET') {
      // Attempt reconnection or other recovery logic
      console.log("Attempting to reconnect to Redis...");
      redisInstance!.connect(); // Attempt to reconnect
    }
    // Optionally exit process or handle other errors
    // process.exit(1);
  });
}

//Ensure redisSubscriber instance in intialized only once 
if(!redisSubscriberInstance){
  redisSubscriberInstance = new Redis(process.env.REDIS_URL);

  // Event listener for the first connection
  redisSubscriberInstance.once("connect", () => {
    console.log("Connected to Redis subscriber");
  });

  // Event listener for errors
  redisSubscriberInstance.on("error", (err: any) => {
    console.error("Error connecting to Redis:", err);
    // Handle specific errors like ECONNRESET here
    if (err.code === 'ECONNRESET') {
      // Attempt reconnection or other recovery logic
      console.log("Attempting to reconnect to Redis...");
      redisSubscriberInstance!.connect(); // Attempt to reconnect
    }
    // Optionally exit process or handle other errors
    // process.exit(1);
  });
}

//Ensure redisPublisher instance in intialized only once 
if(!redisPublishInstance){
  redisPublishInstance = new Redis(process.env.REDIS_URL);

   // Event listener for the first connection
   redisPublishInstance.once("connect", () => {
    console.log("Connected to Redis publisher");
  });

  // Event listener for errors
  redisPublishInstance.on("error", (err: any) => {
    console.error("Error connecting to Redis:", err);
    // Handle specific errors like ECONNRESET here
    if (err.code === 'ECONNRESET') {
      // Attempt reconnection or other recovery logic
      console.log("Attempting to reconnect to Redis...");
      redisPublishInstance!.connect(); // Attempt to reconnect
    }
    // Optionally exit process or handle other errors
    // process.exit(1);
  });
}

export { redisInstance, redisSubscriberInstance ,redisPublishInstance , Redis};
