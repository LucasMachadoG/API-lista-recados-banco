import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract"
import { Return } from "../../../shared/utils/usecase.return"
import { GetUserRepositoryContract } from "../../user/util/user.repository.contract"
import { UpdateRecadosRepositoryContract } from "../util/recado.repository.contract"

interface updateRecadosParams{
    userId: string
    id: string
    descricao?: string
    conteudo?: string
    arquivada?: boolean
}

const recadosCachePrefix = "recados"

export class updateRecadosUsecase {
    constructor(
        private database: UpdateRecadosRepositoryContract,
        private userDatabase: GetUserRepositoryContract,
        private cache: cacheRepositoryContract
    ){}
    public async execute(data: updateRecadosParams): Promise<Return> {
        const user = await this.userDatabase.get(data.userId)

        if(!user) {
            return {
                ok: false,
                message: "Usuario nao encontrado",
                code: 404
            }
        }

        const recado = await this.database.get(data.id)

        if(!recado) {
            return {
                ok: false, 
                message: "Recado nao encontrado",
                code: 404
            }
        }

        await this.database.update(data.id, data.descricao ?? recado.descricao, data.conteudo ?? recado.conteudo, data.arquivada ?? recado.arquivada)

        await this.deleteUsersCacheKeys();

        await this.cache.delete("recado")

        return {
            ok: true, 
            message: "Recado atualizado com sucesso",
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