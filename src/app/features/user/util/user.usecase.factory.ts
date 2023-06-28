import { cacheRepository } from "../../../shared/database/repositories/cache.repository"
import { userDatabase } from "../repositories/user.repository"
import { createUserUsecase } from "../usecases/create.user.usecase"
import { deleteUserUsecase } from "../usecases/delete.user.usecase"
import { getUserUsecase } from "../usecases/get.user.usecase"
import { listUsecase } from "../usecases/list.user.usecase"
import { updateUserUsecase } from "../usecases/update.user.usecase"

export const createUserUsecaseFactory = () => {
    const databaEmail = new userDatabase()
    const database = new userDatabase()
    const cache = new cacheRepository()

    return new createUserUsecase (databaEmail, database, cache)
}

export const listUserUsecaseFactory = () => {
    const database = new userDatabase ()
    const cache = new cacheRepository ()

    return new listUsecase (database, cache)
}

export const deleteUserUsecaseFactory = () => {
    const database = new userDatabase()
    const cache = new cacheRepository()

    return new deleteUserUsecase(database, cache)
}

export const GetUserUsecaseFactory = () => {
    const database = new userDatabase()
    const cache = new cacheRepository()

    return new getUserUsecase (database, cache)
}

export const UpdateUsecaseFactory = () => {
    const database = new userDatabase()
    const cache = new cacheRepository()

    return new updateUserUsecase(database, cache)
}