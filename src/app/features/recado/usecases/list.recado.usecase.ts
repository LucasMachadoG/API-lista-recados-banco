import { Return } from "../../../shared/utils/usecase.retur";
import { recadoDatabase } from "../respositories/recado.repository";

export class listRecadoUsecase {
    public async execute (id: string): Promise<Return> {
        const database = new recadoDatabase()
        const recados = await database.list(id)

        const result = recados.map ((recado) => recado.toJson())

        return {
            ok: true,
            message: "Recados successfully listed!",
            code: 200,
            data: result
        }
    }
}