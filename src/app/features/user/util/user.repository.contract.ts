import { user } from "../../../models/user.models";

export interface CreateUserRepositoryContract {
    create: (user: user) => Promise<user>
}

export interface CreateUserRepositoryEmailContract {
    getByEmail: (email: string) => Promise<user | null>
}

export interface DeleteUserRepositoryContract {
    delete: (id: string) => Promise<number>
}

export interface GetUserRepositoryContract {
    get: (id: string) => Promise<user | null>
}

export interface ListUserRepositoryContract {
    list: (username?: string, email?: string) => Promise<user[]>
}

export interface UpdateUserRepositoryContract {
    update: () => Promise<number>
}
