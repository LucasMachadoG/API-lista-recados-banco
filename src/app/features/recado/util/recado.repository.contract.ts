import { Recados } from "../../../models/recados.model";
import { user } from "../../../models/user.models";

export interface ListRecadoRepositoryContract {
    list: (id: string) => Promise<Recados[]>
}

export interface CreateRecadoRepositoryContract {
    create: (id: string, recado: Recados) => Promise<Recados>
}