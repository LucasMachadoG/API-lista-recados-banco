import { FindManyOptions } from "typeorm";
import { databaseConnection } from "../../../../main/database/typeorm.connection";
import { Recados } from "../../../models/recados.model";
import { RecadoEntity } from "../../../shared/database/entities/recados.entity";

export class RecadoRepository {
    private repository = databaseConnection.connection.getRepository(RecadoEntity)

    public async list(id: string, arquivada?: boolean) {
        const params: FindManyOptions<RecadoEntity> = {};

        if (arquivada !== undefined) {
            params.where = { idUser: id, arquivada };
        } else {
            params.where = { idUser: id };
        }
      
        const result = await this.repository.find(params);
      
        return result.map((item) => RecadoRepository.mapEntityToModel(item));
      }

    public static mapEntityToModel(entity: RecadoEntity): Recados {
        return Recados.create(
            entity.id,
            entity.descricao,
            entity.conteudo,
            entity.arquivada
        )
    }

    public async create(id: string, recado: Recados) {
        const recadoEntity = this.repository.create({
            id: recado.id,
            descricao: recado.descricao,
            conteudo: recado.conteudo,
            idUser: id
        })

        const result = await recadoEntity.save()

        return RecadoRepository.mapEntityToModel(result)
    }

    public async get (id: string) {
        const result = await this.repository.findOneBy({
            id
        })

        if (result === null) {
            return null
        }

        return RecadoRepository.mapEntityToModel(result)
    }

    public async delete (id: string) {
        const result = await this.repository.delete({
            id
        })

        return result.affected ?? 0
    }

    public async update(id: string, descricao: string | undefined, conteudo: string | undefined, arquivada: boolean | undefined) {
        const result = await this.repository.update({
            id
        }, {
            descricao,
            conteudo,
            arquivada
        })

        return result.affected ?? 0
    }
}