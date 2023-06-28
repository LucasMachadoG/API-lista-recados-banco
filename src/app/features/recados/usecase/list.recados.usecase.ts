import { Recados } from "../../../models/recados.model";
import { cacheRepository } from "../../../shared/database/repositories/cache.repository";
import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract";
import { Return } from "../../../shared/utils/usecase.return";
import { GetUserRepositoryContract } from "../../user/util/user.repository.contract";
import { ListRecadoRepositoryContract } from "../util/recado.repository.contract";

const recadosCachePrefix = "recados"

export class listRecadosUsecase{
    constructor(
        private database: ListRecadoRepositoryContract,
        private userDatabase: GetUserRepositoryContract,
        private cache: cacheRepositoryContract
    ){}
    public async execute(id: string, arquivada?: boolean): Promise<Return> {
        const user = await this.userDatabase.get(id)

        if(!user){
            return {
                ok: false,
                message: "Usuario nao encontrado",
                code: 404
            }
        }
 
        const cacheKey = `${recadosCachePrefix}:${id}:${arquivada ?? "todos"}`;
        const cachedRecados = await this.cache.get<Recados[]>(cacheKey);

        if (cachedRecados) {
            return {
                ok: true,
                message: "Recados listados com sucesso (Cache)",
                code: 200,
                data: cachedRecados,
            };
        }

        const recados = await this.database.list(id, arquivada)

        const result = recados?.map((recado) => recado.toJson())

        await this.cache.set(cacheKey, result)

        return {
            ok: true,
            message: "Recados listados com sucesso",
            code: 200,
            data: result
        }
    }
}