import { userDatabase } from "../../user/repositories/user.repository"
import { loginUsecase } from "../usecase/login.usecase"

export const loginUserUsecaseFactory = () => {
    const database = new userDatabase()

    return new loginUsecase(database)
}