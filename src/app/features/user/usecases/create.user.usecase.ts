import { user } from "../../../models/user.models"
import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract"
import { Return } from "../../../shared/utils/usecase.return"
import { CreateUserRepositoryContract, CreateUserRepositoryEmailContract } from "../util/user.repository.contract"

export interface createUserParams {
username: string
    email: string
    password: string
}

const usersCacheKeyPrefix = "users"

export class createUserUsecase {
    constructor (
        private databaseEmail: CreateUserRepositoryEmailContract,
        private database: CreateUserRepositoryContract,
        private cache: cacheRepositoryContract
    ) {}

    public async execute (data: createUserParams): Promise<Return> {
        const userEmail = await this.databaseEmail.getByEmail(data.email)

        if (userEmail) {
            return {
                ok: false,
                message: "Ja existe alguem com esse email cadastrado",
                code: 400
            }
        }

        if(data.password.length < 7) {
            return {
                ok: false, 
                message: "Sua senha precisa ter no minimo 7 caracteres",
                code: 400
            }
        }

        const User = new user (
            data.username,
            data.email,
            data.password
        )

        const result = await this.database.create(User)
        
        await this.deleteUsersCacheKeys();

        await this.cache.delete("user")

        return {
            ok: true,
            code: 200,
            message: "Usuario criado com sucesso",
            data: result.toJason()
        }
    }

    public async deleteUsersCacheKeys() {
        const cacheKeys = await this.cache.keys(`${usersCacheKeyPrefix}*`);

        for (const key of cacheKeys) {
            await this.cache.delete(key);
        }
    }
}