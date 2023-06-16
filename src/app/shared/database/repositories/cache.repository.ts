import Redis from "ioredis";
import { redisConnection } from "../../../../main/database/redis.connection";
import { cacheRepositoryContract } from "../../utils/cache.repository.contract";

export class cacheRepository implements cacheRepositoryContract {
    static set(usersCacheKey: string, result: any[]) {
        throw new Error("Method not implemented.");
    }
    private repository: Redis = redisConnection.connection

    public async get<T>(key: string): Promise<T | null>{
        const result = await this.repository.get(key)

        if(!result) {
            return null
        }

        return JSON.parse(result) as T
    }

    public async set(key: string, value: any): Promise<void>{
        await this.repository.set(key, JSON.stringify(value))
    }

    public async delete (key: string): Promise<void>{
        await this.repository.del(key)
    }
}