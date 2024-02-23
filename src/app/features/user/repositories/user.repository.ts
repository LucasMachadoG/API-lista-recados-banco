import { user } from "../../../models/user.models";
import { databaseConnection } from "../../../../main/database/typeorm.connection";
import { userEntity } from "../../../shared/database/entities/user.entity";

export class userDatabase {
    // A gente usa esse repository para fazer operacoes relacionadas a nossa entidade
    private repository = databaseConnection.connection.getRepository(userEntity)

    public async list (username?: string, email?:string): Promise<user[]> {        
        const result = await this.repository.find({
            where: {
                username, 
                email
            }
        })

        console.log (result)

        return result.map ((user: any) => userDatabase.mapToModel(user))
    }

    public static mapToModel(entity: userEntity): user {
        return user.create(
            entity.id, 
            entity.username, 
            entity.email, 
            entity.password
        )
    }
    
    public async get (id: string){
        const result = await userEntity.findOne({
            where: {
                id
            },
        })

        if (result === null) {
            return null
        }

        return userDatabase.mapToModel(result)
    }
    
    public async create (user: user) {
        const UserEntity = userEntity.create({
            username: user.username,
            email: user.email,
            password: user.password,
            id: user.id 
        })

        const result = await UserEntity.save()

        return userDatabase.mapToModel(result)
    }

    
    public async delete (id: string): Promise<number> {
        const result = await userEntity.delete({
            id
        })
        
        return result.affected ?? 0 
    }

    public async update (id: string, username: string | undefined, email: string | undefined, password: string | undefined): Promise<number> {
        const result = await this.repository.update({
            id
        }, {
            username,
            email,
            password
        })

        return result.affected ?? 0
    }
    
    public async getByEmail (email: string | undefined): Promise<user | null> {
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

    public async getByEmailLogin (email: string, password?: string): Promise<user | null> {
        const result = await this.repository.findOneBy({
            email,
            password
        })

        if (!result) {
            return null
        }

        return userDatabase.mapToModel(result)
    }
}