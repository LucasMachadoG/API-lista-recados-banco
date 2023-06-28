import { NextFunction, Request, Response } from "express";
import { requestError } from "../../../shared/errors/request.error";
import { serverError } from "../../../shared/errors/serverError";

export class createRecadoValidator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        try {
            const { descricao, conteudo } = req.body;
      
            if (!descricao) {
                return requestError.fieldNotProvider(res, "Descricao")
            }
        
            if (!conteudo) {
                return requestError.fieldNotProvider(res, "Conteudo")
            }
        
            next();
            } catch (error: any) {
            return serverError.genericError(res, error);
            }
    }
}