import { user } from "../../../models/user.models"
import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract"
import { Return } from "../../../shared/utils/usecase.return"
import { ListUserRepositoryContract } from "../util/user.repository.contract"

interface listUserParams {
    username?: string | undefined,
    email?: string | undefined
}

const usersCacheKey = "users"

export class listUsecase {
    constructor (
        private database: ListUserRepositoryContract,
        private cache: cacheRepositoryContract
    ) {}

    public async execute (): Promise<Return> {
        const cacheResult = await this.cache.get<user | null>(usersCacheKey)

        if(cacheResult !== null) {
            return {
                ok: true,
                code: 200, 
                message: "Usuarios listados com sucesso! Cache",
                data: cacheResult
            }
        }

        const users = await this.database.list()

        const result =  users.map((user) => user.toJason())

        await this.cache.set(usersCacheKey, result)

        return {
            ok: true,
            message: "Usuarios listados com sucesso!",
            data: result,
            code: 200
        }
    }
}