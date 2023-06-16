import { Request ,Response } from "express";
import { requestError } from "../../../shared/errors/request.error";
import { serverError } from "../../../shared/errors/serverError";
import { updateUserUsecase } from "../usecases/update.user.usecase";
import { 
    createUserUsecaseFactory, 
    listUserUsecaseFactory,
    deleteUserUsecaseFactory,
    GetUserUsecaseFactory,
    UpdateUsecaseFactory
} from "../util/user.usecase.factory";

export class userController {
    public async list (req: Request, res: Response) {
        try { 
            // const { username, email } = req.query

            const usecase = listUserUsecaseFactory()
            const result = await usecase.execute()

            return res.status(result.code).send({
                ok: result.ok,
                message: result.message,
                data: result.data
            })
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public async get (req: Request, res: Response) {
        try {
            const { id } = req.params

            const usecase = GetUserUsecaseFactory()
            const result = await usecase.execute(id)

            return res.status(result.code).send({
                ok: result.ok ,
                message: result.message,
                data: result.data
            })
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public async create (req: Request, res: Response) {
        try {
            const { username, email, password } = req.body 

            const usecase = createUserUsecaseFactory()
            const result = await usecase.execute({
                username, 
                email, 
                password
            })

            return res.status(result.code).send({
                ok: result.ok, 
                message: result.message,
                data: result.data
            })

        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public async delete (req: Request, res: Response) {
        try {
            const { id } = req.params

            const usecase = deleteUserUsecaseFactory()
            const result = await usecase.execute(id)

            return res.status(result.code).send({
                ok: result.ok,
                message: result.message,
                data: id
            })
            
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public async update (req: Request, res: Response) {
        try {
            const { id } = req.params
            const { username, email, password} = req.body

            const usecase = UpdateUsecaseFactory()
            const result = await usecase.execute({
                id, 
                username,
                email, 
                password
            })

            return res.status(result.code).send({
                ok: result.ok, 
                message: result.message,
                data: id
            })
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }
}