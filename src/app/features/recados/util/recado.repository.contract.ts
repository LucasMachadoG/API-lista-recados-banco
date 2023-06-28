import { Recados } from "../../../models/recados.model";

export interface ListRecadoRepositoryContract {
    list: (id: string, arquivada?: boolean | undefined) => Promise<Recados[] | null>
}

export interface CreateRecadoRepositoryContract {
    create: (id: string, recado: Recados) => Promise<Recados>
}

export interface DeleteRecadoRepositoryContract {
    delete: (id: string) => Promise<number>
}

export interface UpdateRecadosRepositoryContract {
    update: (id: string, descricao: string, conteudo: string, arquivada: boolean) => Promise<number>
    get: (id: string) => Promise<Recados | null>
}

export interface GetRecadosRepositoryContract {
    get: (id: string) => Promise<Recados | null>
}