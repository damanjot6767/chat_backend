import { Redis } from "ioredis";

let redisInstance: Redis | null = null;

// Ensure redisInstance is initialized only once
if (!redisInstance) {
  // const redisConfig = {
  //   port: +process.env.REDIS_PORT!,
  //   host: process.env.REDIS_HOST!,
  //   username: process.env.REDIS_USERNAME, // Optional depending on Redis configuration
  //   password: process.env.REDIS_PASSWORD,
  //   db: +process.env.REDIS_DB! || 0 // Defaults to 0 if not provided
  // };

  redisInstance = new Redis(process.env.REDIS_URL,{
    tls: {
      rejectUnauthorized: false // Only necessary if your Redis server uses a self-signed certificate
    }
  });

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

export { redisInstance };
