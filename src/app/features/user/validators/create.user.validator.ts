import { NextFunction, Request, Response } from "express";
import { serverError } from "../../../shared/errors/serverError";
import { requestError } from "../../../shared/errors/request.error";
export class createUserValidator {
    public static async validate(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;
      
            if (!username) {
                return requestError.fieldNotProvider(res, "Username")
            }
        
            if (!email) {
                return requestError.fieldNotProvider(res, "Email")
            }
        
            if (!password) {
                return requestError.fieldNotProvider(res, "Password")
            }
        
            next();
            } catch (error: any) {
            return serverError.genericError(res, error);
            }
    }
}
