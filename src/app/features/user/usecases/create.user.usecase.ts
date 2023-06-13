import { user } from "../../../models/user.models"
import { Return } from "../../../shared/utils/usecase.retur"
import { userDatabase } from "../repositories/user.repository"

interface createUserParams {
    username: string,
    email: string,
    password: string
}

export class createUserUsecase {
    public async execute (data: createUserParams): Promise<Return> {
        const database = new userDatabase ()
        const userEmail = await database.getByEmail(data.email)

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

        const result = await database.create(User)

        return {
            ok: true,
            message: "User successfully created",
            code: 200,
            data: result.toJason()
        }
    }
}