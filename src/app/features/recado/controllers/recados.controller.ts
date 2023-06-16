import { Request, Response } from "express";
import { serverError } from "../../../shared/errors/serverError";
import { userDatabase } from "../../user/repositories/user.repository";
import { requestError } from "../../../shared/errors/request.error";
import { Recados } from "../../../models/recados.model";
import { recadoDatabase } from "../respositories/recado.repository";
import { CreateRecadoUsecaseFactory, ListRecadoUsecaseFactory } from "../util/recado.usecase.factory";

export class recadosController {
    public async list(req: Request, res: Response) {
        try {
            const { id } = req.params
    
            const usecase = ListRecadoUsecaseFactory()
            const result = await usecase.execute(id)
    
            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public async create (req: Request, res: Response) {
        try {
            const { id } = req.params
            const { descricao, conteudo } = req.body

            if (!descricao) {
                return requestError.fieldNotProvider(res, "Descriacao")
            }

            if (!conteudo) {
                return requestError.fieldNotProvider(res, "Conteudo")
            }

            const usecase = CreateRecadoUsecaseFactory()
            const result = await usecase.execute({
                id, 
                descricao,
                conteudo
            })

            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    // public delete (req: Request, res: Response) {
    //     try {
    //         const { userId, id } = req.params

    //         const database = new userDatabase ()
    //         const user = database.get(userId)

    //         if (!user) {
    //             return requestError.notFoundError(res, "User")
    //         }

    //         const recadoIndex = user.recados.findIndex ((recado) => recado.id === id)

    //         if (recadoIndex < 0) {
    //             return requestError.notFoundError(res, "Recado")
    //         }

    //         user.recados.splice (recadoIndex, 1)

    //         return res.status(200).send({
    //             ok: true,
    //             message: "Recado successfully deleted!",
    //         })
    //     } catch (error: any) {
    //         return serverError.genericError(res, error)
    //     }
    // }

    // public update (req: Request, res: Response) {
    //     try {
    //         const { userId, id } = req.params
    //         const { descricao, conteudo } = req.body

    //         const database = new userDatabase()
    //         const user = database.get(userId)

    //         if (!user) {
    //             return requestError.notFoundError(res, "User")
    //         }

    //         const recado = user.recados.find ((recado) => recado.id === id)

    //         if (!recado) {
    //             return requestError.notFoundError(res, "Recado")
    //         }

    //         if (descricao) {
    //             recado.descricao = descricao
    //         }

    //         if (conteudo) {
    //             recado.conteudo = conteudo
    //         }

    //         return res.status(200).send({
    //             ok: true,
    //             message: "Recado successfully updated"
    //         })
    //     } catch (error: any) {
    //         return serverError.genericError(res, error)
    //     }
    // }
}