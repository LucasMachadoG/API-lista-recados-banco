import { Return } from "../../../shared/utils/usecase.return";
import { GetUserRepositoryContract } from "../../user/util/user.repository.contract";
import { ListRecadoRepositoryContract } from "../util/recado.repository.contract";

export class listRecadosUsecase {
    constructor (
        private database: ListRecadoRepositoryContract,
        private userDatabase: GetUserRepositoryContract
    ){}

    public async execute (id: string): Promise<Return> {
        const user = await this.userDatabase.get(id)

        if (!user) {
            return {
                ok: false,
                message: "Usuario nao encontrado",
                code: 400
            }
        }

        const recados = await this.database.list(id)

        const result = recados.map((recado) => recado.toJson())

        return {
            ok: true,
            message: "Recados listados com sucesso",
            code: 200,
            data: result
        }
    }
}