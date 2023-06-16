import { cacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Return } from "../../../shared/utils/usecase.return";
import { userDatabase } from "../repositories/user.repository";

interface updateUsecaseParams {
    id: string,
    username?: string,
    email?: string,
    password?: string
}

const usersCacheKey = "users"

export class updateUserUsecase {

    constructor(
        private database: userDatabase,
        private cache: cacheRepository
    ) {}

    public async execute (data: updateUsecaseParams): Promise<Return> {
        const userEmail = await this.database.getByEmail(data.email)
 
         if (userEmail) {
             return {
                 ok: false,
                 message: "Ja existe alguem cadastrado com esse email",
                 code: 400
             }
         }
         
        const result = await this.database.update(data.id, data.username, data.email, data.password)

        if (result === 0) {
            return {
                ok: false,
                message: "User not found",
                code: 400
            }
        }

        await this.cache.delete(usersCacheKey)

        return {
            ok: true,
            message: "User successfully updated",
            code: 200
        }


    }   
}