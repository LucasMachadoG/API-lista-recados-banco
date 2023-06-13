import { Request ,Response } from "express";
import { userDatabase } from "../repositories/user.repository";
import { requestError } from "../../../shared/errors/request.error";
import { serverError } from "../../../shared/errors/serverError";
import { createUserUsecase } from "../usecases/create.user.usecase";
import { listUsecase } from "../usecases/list.user.usecase";
import { getUsecase } from "../usecases/get.user.usecase";
import { deleteUserUsecase } from "../usecases/delete.user.usecase";
import { updateUserUsecase } from "../usecases/update.user.usecase";
import { loginUserUsecase } from "../usecases/login.user.usecase";

export class userController {
    public async list (req: Request, res: Response) {
        try { 
            const { username, email } = req.query

            const result = await new listUsecase().execute({
                username: username ? username.toString() : undefined,
                email: email ? email.toString() : undefined,
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

    public async get (req: Request, res: Response) {
        try {
            const { id } = req.params

            const result = await new getUsecase().execute(id)

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

            const result = await new createUserUsecase().execute({
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

            const result = await new deleteUserUsecase().execute(id)

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

            const result =await new updateUserUsecase().execute({
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

    public async loginValida (req: Request, res: Response) {
        try {
            const { email, password } = req.body

            if (!email) {
                return requestError.fieldNotProvider(res, "Email")
            }

            if (!password) {
                return requestError.fieldNotProvider(res, "Password")
            }

            const result = await new loginUserUsecase().execute(email, password)

            return res.status(result.code).send({
                ok: result.ok,
                message: result.message,
                id: result.data
            })
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }   
    
}