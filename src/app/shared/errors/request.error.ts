import { Response } from "express";

export class requestError {
    public static fieldNotProvider (res: Response, field: string) {
        return res.status(400).send({
            ok: false,
            message: field + "was not provider!"
        })
    }

    public static notFoundError (res: Response, entity: string) {
        return res.status(404).send({
            ok: false,
            message: entity + "not found!"
        })
    }
}