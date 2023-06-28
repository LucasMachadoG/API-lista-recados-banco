import { Request, Response } from "express";
import { serverError } from "../../../shared/errors/serverError";
import { createRecadoUsecaseFactory, deleteRecadosUsecaseFactory, getRecadosUsecaseFactory, listRecadoUsecaseFactory, updateRecadosUsecaseFactory } from "../util/recado.usecase.factory";

export class RecadoController {
    public async list(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { arquivada } = req.query
            const Arquivada = Boolean(arquivada)

            const database = listRecadoUsecaseFactory()
            const result = await database.execute(id, Arquivada)

            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public async get(req: Request, res: Response) {
        try {
            const { userId, id } = req.params

            const usecase = getRecadosUsecaseFactory()
            const result = await usecase.execute({
                userId, 
                id
            })

            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { descricao, conteudo } = req.body

            const database = createRecadoUsecaseFactory()
            const result = await database.execute({
                id,
                descricao,
                conteudo
            })

            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { userId, id } = req.params
    
            const database = deleteRecadosUsecaseFactory()
            const result = await database.execute({
                id,
                userId
            })
    
            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { userId, id } = req.params
            const { descricao, conteudo, arquivada } = req.body
    
            const usecase = updateRecadosUsecaseFactory()
            const result = await usecase.execute({
                userId, 
                id, 
                descricao, 
                conteudo, 
                arquivada
            })
    
            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }
}