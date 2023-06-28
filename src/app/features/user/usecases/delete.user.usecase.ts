import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract";
import { Return } from "../../../shared/utils/usecase.return";
import { DeleteUserRepositoryContract } from "../util/user.repository.contract";

const usersCacheKeyPrefix = "users"

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
                code: 404,
                message: "Usuario nao encontrado"
            }
        }

        await this.deleteUsersCacheKeys();

        await this.cache.delete("user")

        return {
            ok: true,
            code: 200,
            message: "Usuario deletado com sucesso"
        }
    }

    public async deleteUsersCacheKeys() {
        const cacheKeys = await this.cache.keys(`${usersCacheKeyPrefix}*`);

        for (const key of cacheKeys) {
            await this.cache.delete(key);
        }
    }
}