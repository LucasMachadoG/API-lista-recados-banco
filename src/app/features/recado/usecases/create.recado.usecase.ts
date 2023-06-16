import { Recados } from "../../../models/recados.model";
import { Return } from "../../../shared/utils/usecase.return";
import { GetUserRepositoryContract } from "../../user/util/user.repository.contract";
import { CreateRecadoRepositoryContract } from "../util/recado.repository.contract";

interface createRecadoParams {
    id: string
    descricao: string
    conteudo: string
}

export class createRecadoUsecase {
    constructor (
        private database: CreateRecadoRepositoryContract,
        private userDatabase: GetUserRepositoryContract
    ){}

    public async execute(data: createRecadoParams): Promise<Return>{
        const user = await this.userDatabase.get(data.id)

        if(!user) {
            return {
                ok: false,
                message: "Usuario nao encontrado",
                code: 400
            }
        }

        const recado = await this.database.create(
            data.id,
            new Recados(data.descricao, data.conteudo)
        )

        return {
            ok: true, 
            message: "Recado criado com sucesso",
            code: 200,
            data: recado
        }
    }   
}