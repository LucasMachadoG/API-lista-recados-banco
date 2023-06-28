import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract";
import { Return } from "../../../shared/utils/usecase.return";
import { GetUserRepositoryContract } from "../../user/util/user.repository.contract";
import { DeleteRecadoRepositoryContract } from "../util/recado.repository.contract";

interface deleteRecadosParams {
    id: string,
    userId: string
}

const recadosCachePrefix = "recados"

export class deleteRecadosUsecase {
    constructor(
        private database: DeleteRecadoRepositoryContract,
        private UserDatabase: GetUserRepositoryContract,
        private cache: cacheRepositoryContract
    ) {}

    public async execute(data: deleteRecadosParams): Promise<Return> {
        const user = await this.UserDatabase.get(data.userId)

        if(!user) {
            return {
                ok: false,
                message: "Usuario nao encontrado",
                code: 404
            }
        }

        const result = await this.database.delete(data.id)

        if(result === 0) {
            return {
                ok: false, 
                message: "Recado nao encontrado",
                code: 404
            }
        }

        await this.deleteUsersCacheKeys();

        await this.cache.delete("recado")

        return {
            ok: true, 
            message: "Recado deletado com sucesso",
            code: 200,
            data: data.id
        }
    }

    public async deleteUsersCacheKeys() {
        const cacheKeys = await this.cache.keys(`${recadosCachePrefix}*`);

        for (const key of cacheKeys) {
            await this.cache.delete(key);
        }
    }
}