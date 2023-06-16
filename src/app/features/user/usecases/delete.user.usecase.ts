import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract";
import { Return } from "../../../shared/utils/usecase.return";
import { DeleteUserRepositoryContract } from "../util/user.repository.contract";

const usersCacheKey = "users"

export class deleteUserUsecase {
    constructor (
        private database: DeleteUserRepositoryContract,
        private cache: cacheRepositoryContract
    ) {}

    public async execute (id: string): Promise<Return> {
        const result = await this.database.delete(id)

        if (result === 0) {
            return {
                ok: false,
                message: "User not found",
                code: 400
            }
        }

        await this.cache.delete(usersCacheKey)

        return {
            ok: true,
            message: "User successfully deleted",
            code: 200
        }
    }
}