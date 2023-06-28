import { user } from "../../../models/user.models";

export interface LoginRepositoryContract {
    getByEmailLogin: (email: string, password: string) => Promise<user | null>
}