import { user } from "../../../models/user.models"
import { cacheRepositoryContract } from "../../../shared/utils/cache.repository.contract"
import { Return } from "../../../shared/utils/usecase.return"
import { userDatabase } from "../repositories/user.repository"
import { CreateUserRepositoryContract } from "../util/user.repository.contract"

export interface createUserParams {
    username: string,
    email: string,
    password: string
}

const usersCacheKey = "users"

export class createUserUsecase {
    constructor (
        private database: CreateUserRepositoryContract,
        private cache: cacheRepositoryContract
    ) {}

    public async execute (data: createUserParams): Promise<Return> {
        const userEmail = await this.database.getByEmail(data.email)

        let errors: string[] = []

        if (userEmail) {
            return {
                ok: false,
                message: "Ja existe alguem com esse email cadastrado",
                code: 400
            }
        }

        if (!data.username) {
            errors.push ("Username was not provider!")
        }

        if (!data.email) {
            errors.push ("Email was not provider!")
        }

        if (!data.password) {
            errors.push ("Password was not provider!")
        }

        if (errors.length > 0) {
            return {
                ok: false,
                message: `Os seguintes erros aconteceram: ${errors.join(", ")}`,
                code: 400
            }
        }

        const User = new user (
            data.username,
            data.email,
            data.password
        )

        const result = await this.database.create(User)
        
        await this.cache.delete(usersCacheKey)

        return {
            ok: true,
            message: "User successfully created",
            code: 200,
            data: result.toJason()
        }
    }
}