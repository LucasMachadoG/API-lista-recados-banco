import { Request, Response } from "express";
import { serverError } from "../../../shared/errors/serverError";
import { loginUserUsecaseFactory } from "../util/login.usecase.factory";

export class loginController {
    public async login (req: Request, res: Response) {
        try {
            const { email, password } = req.body

			const database = loginUserUsecaseFactory()
            const result = await database.execute({
                email,
                password
            })

            return res.status(result.code).send(result)
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }
}
