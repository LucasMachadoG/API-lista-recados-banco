import { Recados } from "../../../models/recados.model";
import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract";
import { Return } from "../../../shared/utils/usecase.return";
import { GetUserRepositoryContract } from "../../user/util/user.repository.contract";
import { CreateRecadoRepositoryContract } from "../util/recado.repository.contract";

interface createRecadoParams {
    id: string
    descricao: string,
    conteudo: string
}

const recadosCachePrefix = "recados"

export class createRecadosUsecase{
    constructor(
        private database: CreateRecadoRepositoryContract,
        private UserDatabase: GetUserRepositoryContract,
        private cache: cacheRepositoryContract
    ){}
    public async execute(data: createRecadoParams): Promise<Return> {
        const errors: string[] = []

        const user = await this.UserDatabase.get(data.id)

        if(!user) {
            return {
                ok: false, 
                message: "Usuario nao encontrado",
                code: 404
            }
        }
        
        const recado = new Recados(data.descricao, data.conteudo)
        const result = await this.database.create(data.id, recado)

        await this.deleteUsersCacheKeys();

        await this.cache.delete("recado")

        return {
            ok: true, 
            message: "Recado criado com sucesso",
            code: 201,
            data: result.toJson()
        }
    }

    public async deleteUsersCacheKeys() {
        const cacheKeys = await this.cache.keys(`${recadosCachePrefix}*`);

        for (const key of cacheKeys) {
            await this.cache.delete(key);
        }
    }
}