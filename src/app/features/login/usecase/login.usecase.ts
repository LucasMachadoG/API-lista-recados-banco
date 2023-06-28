import { jwtAdapter } from "../../../shared/utils/jwtadapter"
import { Return } from "../../../shared/utils/usecase.return"
import { LoginRepositoryContract } from "../util/login.repositoy.contract"

export interface loginParams {
    email: string
    password: string
}

export class loginUsecase {
    constructor (
        private database: LoginRepositoryContract
    ) {}

    public async execute (data: loginParams): Promise<Return> {
        const usuario = await this.database.getByEmailLogin(data.email, data.password)

        if(!usuario) {
            return {
                ok: false, 
                code: 403,
                message: "Email/Senha incorretos!"
            }
        }

        const token = jwtAdapter.createToken(usuario)

        return {
            ok: true, 
            code: 200,
            message: "Login efetuado com sucesso!",
            data: {
                ...usuario,
                token
            }
        }
    }
}