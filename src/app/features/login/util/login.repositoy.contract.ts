import { loginParams } from "../usecase/login.usecase";

export interface LoginRepositoryContract {
    login: (email: string, password: string) => Promise<any>
}