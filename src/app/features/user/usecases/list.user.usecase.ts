import { user } from "../../../models/user.models"
import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract"
import { Return } from "../../../shared/utils/usecase.return"
import { ListUserRepositoryContract } from "../util/user.repository.contract"

interface ListUserParams {
    username: string
    email: string
}

const usersCacheKeyPrefix = "users"

export class listUsecase {
    constructor (
        private database: ListUserRepositoryContract,
        private cache: cacheRepositoryContract
    ) {}

    public async execute (data: ListUserParams): Promise<Return> {
        const cacheKey = `${usersCacheKeyPrefix}:${data.username ?? ""}:${data.email ?? ""}`;

        const cacheResult = await this.cache.get<user | null>(cacheKey)

        if(cacheResult) {
            return {
                ok: true,
                code: 200, 
                message: "Usuarios listados com sucesso! Cache",
                data: cacheResult
            }
        }

        const users = await this.database.list(data.username, data.email)

        const result =  users.map((user) => user.toJason())

        if (result.length > 0) {
            await this.cache.set(cacheKey, result);
        }

        return {
            ok: true,
            code: 200,
            message: "Usuarios listados com sucesso!",
            data: result,
        }
    }
}