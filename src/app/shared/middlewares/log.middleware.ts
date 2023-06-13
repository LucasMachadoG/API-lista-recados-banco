import { NextFunction, Request, Response } from "express";

const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log ("\nA rota foi executada com sucesso\n")
    console.log (`Hostname: ${req.hostname}\n`)
    console.log (`IP: ${req.ip}\n`)
    console.log (`Protocolo: ${req.protocol}\n`)

    next ()
}

const logMethodMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log (`O metodo chamado foi ${req.method}`)

    next ()
}

export const middlewaresForMethodAndLog = [logMiddleware, logMethodMiddleware]

