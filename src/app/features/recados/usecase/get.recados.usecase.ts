import { Recados } from "../../../models/recados.model";
import { cacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/utils/usecase.return";
import { GetUserRepositoryContract } from "../../user/util/user.repository.contract";
import { GetRecadosRepositoryContract } from "../util/recado.repository.contract";

interface getRecadosParams {
    userId: string
    id: string
}

const recadoCacheKey = "recado"

export class getRecadosUsecase {
    constructor(
        private database: GetRecadosRepositoryContract,
        private userDatabase: GetUserRepositoryContract,
        private cache: cacheRepository
    ){}
    public async execute(data: getRecadosParams): Promise<Return> {
        const user = await this.userDatabase.get(data.userId) 

        if(!user) {
            return {
                ok: false,
                message: "Usuario nao encontrado",
                code: 404
            }
        }

        const cacheResult = await this.cache.get<Recados | null>(recadoCacheKey)

        if(cacheResult !== null) {
            return {
                ok: true,
                message: "Recado listado com sucesso (cache)",
                code: 200,
                data: cacheResult
            }
        }

        const result = await this.database.get(data.id)

        if(result === null) {
            return {
                ok: false, 
                message: "Recado nao encontrado",
                code: 404
            }
        }

        await this.cache.set(recadoCacheKey, result)

        return {
            ok: true, 
            message: "Recado listado com sucesso",
            code: 200,
            data: result.toJson()
        }
    }
}