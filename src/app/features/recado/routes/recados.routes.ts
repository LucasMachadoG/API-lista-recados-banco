import { Router } from "express"
import { middlewaresForMethodAndLog } from "../../../shared/middlewares/log.middleware"
import { recadosController } from "../controllers/recados.controller"

export const recadosRoutes = () => {
    const app = Router()

    app.get ("/:id/recados", middlewaresForMethodAndLog, new recadosController().list)

    return app
}