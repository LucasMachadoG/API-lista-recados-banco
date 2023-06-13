import { Recados } from "../../../models/recados.model";
import { databaseConnection } from "../../../../main/database/typeorm.connection";
import { recadoEntity } from "../../../shared/database/entities/recado.entity";

export class recadoDatabase {
    private repository = databaseConnection.connection.getRepository(recadoEntity)

    public async list (id: string, nome?: string, arquivado?: boolean) {
        const parametros: any = {
            id,
        };
            
        if (nome !== undefined) {
            parametros.nome = nome;
        }
        
        if (arquivado !== undefined) {
            parametros.arquivado = arquivado;
        }

        const result = await this.repository.find({
            where: parametros
        })

        return result.map ((item) => recadoDatabase.mapEntityModel(item))
    }

    public static mapEntityModel (entity: recadoEntity): Recados {
        // const userEntity = entity.user

        // const user = userDatabase.mapToModel(userEntity)

        return Recados.create(
            entity.id,
            entity.nome,
            entity.descricao,
            entity.conteudo
            // result
        )
    }

    public async create (id: string, recado: Recados) {
        const RecadoEntity = this.repository.create({
            id: recado.id,
            descricao: recado.descricao,
            conteudo: recado.conteudo,
            idUser: id
        })

        const result = await this.repository.save(RecadoEntity)

        return recadoDatabase.mapEntityModel(result)
    }
}