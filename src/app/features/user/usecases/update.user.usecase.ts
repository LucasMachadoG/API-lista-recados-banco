import { Return } from "../../../shared/utils/usecase.retur";
import { userDatabase } from "../repositories/user.repository";

interface updateUsecaseParams {
    id: string,
    username: string,
    email: string,
    password: string
}

export class updateUserUsecase {
    public async execute (data: updateUsecaseParams): Promise<Return> {
        const database = new userDatabase()
        const userEmail = await database.get(data.id)

        if (userEmail) {
            return {
                ok: false,
                message: "Ja existe alguem cadastrado com esse email",
                code: 400
            }
        }

        const result = await database.update(data.id, data.username, data.email, data.password)

        if (result === 0) {
            return {
                ok: false,
                message: "User not found",
                code: 400
            }
        }

        return {
            ok: true,
            message: "User successfully updated",
            code: 200
        }


    }   
}