import { Router } from "express"
import { loginController } from "../controllers/login.controller"


export const loginRoutes = () => {
    const router = Router ()

    router.post ("/", new loginController().login)

    return router
}