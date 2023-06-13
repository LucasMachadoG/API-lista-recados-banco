import { Return } from "../../../shared/utils/usecase.retur";
import { userDatabase } from "../repositories/user.repository";

export class getUsecase {
    public async execute (id: string): Promise<Return> {
        const database = new userDatabase()
        const user = await database.get(id)

        if (!user) {
            return {
                ok: false,
                message: "User not found!",
                code: 400
            }
        }

        return {
            ok: true,
            message: "User successfully listed",
            data: user.toJason(),
            code: 200
        }
    }
}