import Redis from "ioredis";
import { redisConnection } from "../../../../main/database/redis.connection";
import { cacheRepositoryContract } from "../../utils/cache.repository.contract";

export class cacheRepository implements cacheRepositoryContract {
    private repository: Redis = redisConnection.connection

    public async get<T>(key: string): Promise<T | null>{
        const result = await this.repository.get(key)

        if(!result) {
            return null
        }

        return JSON.parse(result) as T
    }

    public async set(key: string, value: any): Promise<any>{
        await this.repository.set(key, JSON.stringify(value))
    }

    public async delete(key: string): Promise<any> {
        await this.repository.del(key);
    }

    public async keys(pattern: string): Promise<string[]> {
        return await this.repository.keys(pattern);
    }
}