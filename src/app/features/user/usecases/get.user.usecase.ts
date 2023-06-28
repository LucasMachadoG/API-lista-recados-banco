import { user } from "../../../models/user.models";
import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract";
import { Return } from "../../../shared/utils/usecase.return";
import { GetUserRepositoryContract } from "../util/user.repository.contract";

const usersCacheKey = "user"

export class getUserUsecase {
    constructor(
        private database: GetUserRepositoryContract,
        private cache: cacheRepositoryContract
    ) {}

    public async execute (id: string): Promise<Return> {

        const cacheResult = await this.cache.get<user | null>(usersCacheKey)

        if(cacheResult !== null) {
            return {
                ok: true,
                code: 200, 
                message: "Usuario listado com sucesso! Cache",
                data: cacheResult.toJason()
            }
        }

        const user = await this.database.get(id)

        if (!user) {
            return {
                ok: false,
                code: 404,
                message: "Usuario nao encontrado",
            }
        }

        const result = user.toJason()

        await this.cache.set(usersCacheKey, user)

        return {
            ok: true,
            code: 200,
            message: "Usuario listado com sucesso",
            data: result
        }
    }
}