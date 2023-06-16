import { user } from "../../../models/user.models";

export interface CreateUserRepositoryContract {
    create: (user: user) => Promise<user>
    getByEmail: (email: string) => Promise<user | null>
}

export interface DeleteUserRepositoryContract {
    delete: (id: string) => Promise<number>
}

export interface GetUserRepositoryContract {
    get: (id: string) => Promise<user | null>
}

// export interface ListUserRepositoryParams {
//     nome: string
//     arquivada: string
// }

export interface ListUserRepositoryContract {
    list: () => Promise<any[]>
}

export interface UpdateUserRepositoryContract {
    
}
