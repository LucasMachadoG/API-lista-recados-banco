import { userDatabase } from "../../user/repositories/user.repository";
import { recadoDatabase } from "../respositories/recado.repository";
import { createRecadoUsecase } from "../usecases/create.recado.usecase";
import { listRecadosUsecase } from "../usecases/list.recado.usecase";

export const ListRecadoUsecaseFactory = () => {
    const database = new recadoDatabase()
    const UserDatabase =  new userDatabase()

    return new listRecadosUsecase(database, UserDatabase)
}

export const CreateRecadoUsecaseFactory = () =>{
    const database = new recadoDatabase()
    const UserDatabase = new userDatabase()

    return new createRecadoUsecase(database, UserDatabase)
}
