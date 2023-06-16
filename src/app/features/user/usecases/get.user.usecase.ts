import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract";
import { Return } from "../../../shared/utils/usecase.return";
import { userDatabase } from "../repositories/user.repository";
import { GetUserRepositoryContract } from "../util/user.repository.contract";

const usersCacheKey = "user"

export class getUserUsecase {
    constructor(
        private database: GetUserRepositoryContract,
        // private cache: cacheRepositoryContract
    ) {}

    public async execute (id: string): Promise<Return> {

        // const cacheResult = await this.cache.get(usersCacheKey)

        // if(cacheResult !== null) {
        //     return {
        //         ok: true,
        //         code: 200, 
        //         message: "Usuarios listados com sucesso! Cache",
        //         data: cacheResult
        //     }
        // }

        const user = await this.database.get(id)

        if (!user) {
            return {
                ok: false,
                message: "User not found!",
                code: 400
            }
        }

        // await this.cache.set(usersCacheKey, user)

        return {
            ok: true,
            message: "User successfully listed",
            data: user.toJason(),
            code: 200
        }
    }
}