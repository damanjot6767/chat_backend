import { Redis } from "ioredis";

const redisInstance = new Redis({

  port: +process.env.REDIS_PORT, // Redis port
  host: process.env.REDIS_HOST, // Redis host
  username: process.env.REDIS_USERNAME, // needs Redis >= 6
  password: process.env.REDIS_PASSWORD,
  db: +process.env.REDIS_DB, // Defaults to 0

})
export { redisInstance }
