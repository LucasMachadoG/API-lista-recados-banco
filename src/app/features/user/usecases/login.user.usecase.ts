import { Return } from "../../../shared/utils/usecase.retur"
import { userDatabase } from "../repositories/user.repository"

export class loginUserUsecase {
    public async execute (email: string, password: string): Promise<Return> {
        const database = new userDatabase()
        const userEmail = await database.getByEmail(email)

        if (!userEmail) {
            return {
                ok: false, 
                message: "Verique o seu email e senha!",
                code: 400
            }
        }

        if (userEmail.password !== password) {
            return {
                ok: false,
                message: "Verifique o seu email e senha!",
                code: 400
            }
        }

        return {
            ok: true,
            message: "Login efetuado com sucesso!",
            code: 200,
            data: userEmail.id
        }
    }
}