import { Recados } from "../../../models/recados.model";
import { databaseConnection } from "../../../../main/database/typeorm.connection";
import { recadoEntity } from "../../../shared/database/entities/recado.entity";

export class recadoDatabase {
    private repository = databaseConnection.connection.getRepository(recadoEntity)

    public async list (id: string) {
        const result = await this.repository.find({
            where: { idUser: id }
        })

        return result.map ((item) => recadoDatabase.mapEntityModel(item))
    }

    public static mapEntityModel (entity: recadoEntity): Recados {
        return Recados.create(
            entity.id,
            entity.descricao,
            entity.conteudo
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