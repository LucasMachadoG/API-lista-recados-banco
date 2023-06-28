import { NextFunction, Request, Response } from "express";
import { serverError } from "../../../shared/errors/serverError";
import { jwtAdapter } from "../../../shared/utils/jwtadapter";

export const checkLoginValidator = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"]
        req.headers ["user"] = ""

        if(!token) {
            return res.status(401).send({
                ok: false,
                message: "O token nao foi informado"
            })
        }

        const usuario = jwtAdapter.checkToken(token)
        req.headers["user"] = JSON.stringify(usuario)

        next()
    } catch (error: any) {
        return serverError.genericError(res, error)
    }
}