import { Return } from "../../../shared/utils/usecase.retur";
import { userDatabase } from "../repositories/user.repository";

export class deleteUserUsecase {
    public async execute (id: string): Promise<Return> {
        const database = new userDatabase()
        const result = await database.delete(id)

        if (result === 0) {
            return {
                ok: false,
                message: "User not found",
                code: 400
            }
        }

        return {
            ok: true,
            message: "User successfully deleted",
            code: 200
        }
    }
}