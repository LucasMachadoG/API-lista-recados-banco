import { Router } from "express";
import { userController } from "../controller/user.controller";
import { createUserValidator } from "../validators/create.user.validator";

export const userRoutes = () => {
    const app = Router()

    //GET http://localhost:3333/user
    app.get ("/", new userController().list)

    //GET http://localhost:3333/user/abc-1234
    app.get ("/:id", new userController().get)

    //PUT http://localhost:3333/user
    app.post ("/", createUserValidator.validate, new userController().create)

    //DELETE http://localhost:3333/user/abc-1234
    app.delete ("/:id", new userController().delete)
    
    //POST http://localhost:3333/user
    app.put ("/:id", new userController().update)

    return app
}