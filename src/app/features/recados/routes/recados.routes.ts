import { Router } from "express";
import { RecadoController } from "../controller/recado.controller";
import { createRecadoValidator } from "../validators/create.recados.validator";
import { checkLoginValidator } from "../../login/validators/check.login.validator";

export const recadosRoutes = () => {
    const app = Router()

    app.get("/:id/recados", checkLoginValidator, new RecadoController().list)

    app.get("/:userId/recados/:id", checkLoginValidator, new RecadoController().get)

    app.post("/:id/recados", createRecadoValidator.validate, checkLoginValidator, new RecadoController().create)

    app.delete("/:userId/recados/:id", checkLoginValidator, new RecadoController().delete)

    app.put("/:userId/recados/:id", checkLoginValidator, new RecadoController().update)

    return app
}