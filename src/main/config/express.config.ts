// nmp install dotenv cors 
//npm install @types/cors
import cors from "cors" //Cors define regras para que nossa API seja chamada de alguma origem
import express from "express"
import { userRoutes } from "../../app/features/user/routes/user.routes"
import { recadosRoutes } from "../../app/features/recado/routes/recados.routes"

export const createApp = () => {
    const app = express ()

    app.use(express.json())
    app.use(cors())
    app.use("/user", userRoutes(), recadosRoutes())

    return app
}