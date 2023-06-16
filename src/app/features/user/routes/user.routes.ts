import { Router } from "express";
import { userController } from "../controller/user.controller";
import { middlewaresForMethodAndLog } from "../../../shared/middlewares/log.middleware";

export const userRoutes = () => {
    const app = Router()

    //GET http://localhost:3333/user
    app.get ("/", middlewaresForMethodAndLog, new userController().list)

    //GET http://localhost:3333/user/abc-1234
    app.get ("/:id", middlewaresForMethodAndLog, new userController().get)

    //PUT http://localhost:3333/user
    app.post ("/", middlewaresForMethodAndLog, new userController().create)

    //DELETE http://localhost:3333/user/abc-1234
    app.delete ("/:id", middlewaresForMethodAndLog, new userController().delete)
    
    //POST http://localhost:3333/user
    app.put ("/:id", middlewaresForMethodAndLog, new userController().update)

    let nome: string = "Lucas"

    nome = "vini"


    return app
}