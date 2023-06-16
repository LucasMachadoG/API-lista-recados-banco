import  Redis  from "ioredis"
import { redisConfig } from "../config/redis.config"

export class redisConnection {
    private static _connection: Redis

    public static async connect() {
        this._connection = new Redis (redisConfig)
        console.log("Redis connected!")
    }

    public static get connection() {
        return this._connection
    }
}