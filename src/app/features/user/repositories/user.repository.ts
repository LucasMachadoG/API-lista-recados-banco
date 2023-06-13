import { user } from "../../../models/user.models";
import { databaseConnection } from "../../../../main/database/typeorm.connection";
import { userEntity } from "../../../shared/database/entities/user.entity";
import { recadoDatabase } from "../../recado/respositories/recado.repository";

export class userDatabase {
    // A gente usa esse repository para fazer operacoes relacionadas a nossa entidade
    private repository = databaseConnection.connection.getRepository(userEntity)

    public async list (username?: string, email?: string): Promise<user[]> {
        //Fazendo a conexao
        // const connection = databaseConnection.connection
        //Pegando o repositorio da conexao
        //O repositorio vai fazer o acesso ao banco de dados, que nos auxilia com as operacoes
        // const repository = connection.getRepository(userEntity)
        
        const result = await this.repository.find({
            where: {
                username,
                email
            },
            relations: ["recados"]
        }) 

        console.log (result)

        return result.map ((user: any) => userDatabase.mapToModel(user))
    }

    public static mapToModel(entity: userEntity): user {
        const recadoEntity = entity.recados ?? []

        const recados = recadoEntity.map(item => recadoDatabase.mapEntityModel(item))

        return user.create(
            entity.id, 
            entity.username, 
            entity.email, 
            entity.password, 
            recados
            )
    }
    
    public async get (id: string){
        const result = await userEntity.findOneBy({
            id
        })

        if (result === null) {
            return null
        }

        return userDatabase.mapToModel(result)
    }

    public async create (user: user) {
        // users.push (user)
        // Aqui no create nos estamos recebendo como parametro um user, porem nos temos que transaformar
        //esse user em uma entity

        // Aqui nos nao vamos usar o await, porque o create nao salva no banco de dados, nao faz o insert
        //ele apenas cria uma instancia
        const UserEntity = userEntity.create({
            username: user.username,
            email: user.email,
            password: user.password,
            id: user.id 
            // Aqui nos estamos passando o id pq vamos considerar que ele vai ser criado pelo back end
        })

        // Ja aq a propria instancia dela ja tem o save, entao nao precisa receber parametro
        const result = await UserEntity.save()

        // Aqui nos estamos usando um repositorio para salva a entity tendo que passar a entity como parametro
        // const result2 = await this.repository.save(UserEntity)

        return userDatabase.mapToModel(result)
    }

    
    public async delete (id: string): Promise<number> {
        const result = await userEntity.delete({
            id
        })
        
        return result.affected ?? 0 
    }

    public async update (id: string, username: string | undefined, email: string | undefined, password: string | undefined): Promise<number> {
        // O meu update vai ter dois parametros
        // O primeiro parametro eh o criterio no qual eu vou atualizar
        // O segundo parametro vai ser um objeto partialEntity, tudo ali dentro vai ser opcional
        const result = await this.repository.update({
            id
        }, {
            username,
            email,
            password,
            dthratualizacao: new Date()
        })

        return result.affected ?? 0
    }

    // public async updateSave (id: string, username: string, email): Promise<number> {

    // }
    
    public async getByEmail (email: string) {
        const result = await this.repository.findOne({
            where:{
                email
            }
        })

        if (result === null) {
            return null
        }

        return userDatabase.mapToModel(result)
    }
}