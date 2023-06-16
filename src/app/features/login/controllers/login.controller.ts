import { Request, Response } from "express";
import { serialize } from "v8";
import { serverError } from "../../../shared/errors/serverError";

export class loginController {
	public async login (req: Request, res: Response) {
		try {
			
		} catch (error: any) {
			return serverError.genericError(res, error)
		}
	}
}
