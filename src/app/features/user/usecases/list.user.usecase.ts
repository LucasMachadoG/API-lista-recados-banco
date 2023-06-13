import { Return } from "../../../shared/utils/usecase.retur"
import { userDatabase } from "../repositories/user.repository"

interface listUserParams {
    username?: string | undefined,
    email?: string | undefined
}

export class listUsecase {
    public async execute (data: listUserParams): Promise<Return> {
        const database = new userDatabase()
        const users = await database.list(
            data.username,
            data.email
        )

        const result =  users.map((user) => user.toJason())

        return {
            ok: true,
            message: "Users successfully listed",
            data: result,
            code: 200
        }
    }
}