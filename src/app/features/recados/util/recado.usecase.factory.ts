import { cacheRepository } from "../../../shared/database/repositories/cache.repository"
import { userDatabase } from "../../user/repositories/user.repository"
import { RecadoRepository } from "../database/recado.repository"
import { createRecadosUsecase } from "../usecase/create.recados.usecase"
import { deleteRecadosUsecase } from "../usecase/delete.recados.usecase"
import { getRecadosUsecase } from "../usecase/get.recados.usecase"
import { listRecadosUsecase } from "../usecase/list.recados.usecase"
import { updateRecadosUsecase } from "../usecase/update.recados.usecase"

export const listRecadoUsecaseFactory = () => {
    const database = new RecadoRepository()
    const UserDatabase = new userDatabase()
    const cache = new cacheRepository()

    return new listRecadosUsecase(database, UserDatabase, cache)
}

export const createRecadoUsecaseFactory = () => {
    const database = new RecadoRepository()
    const UserDatabase = new userDatabase()
    const cache = new cacheRepository()

    return new createRecadosUsecase(database, UserDatabase, cache)
}

export const deleteRecadosUsecaseFactory = () => {
    const database = new RecadoRepository()
    const UserDatabase = new userDatabase()
    const cache = new cacheRepository()

    return new deleteRecadosUsecase(database, UserDatabase, cache)
}

export const updateRecadosUsecaseFactory = () => {
    const database = new RecadoRepository()
    const UserDatabase = new userDatabase()
    const cache = new cacheRepository()

    return new updateRecadosUsecase(database, UserDatabase, cache)
}

export const getRecadosUsecaseFactory = () => {
    const database = new RecadoRepository()
    const UserDatabase = new userDatabase()
    const cache = new cacheRepository()

    return new getRecadosUsecase(database, UserDatabase, cache)
}