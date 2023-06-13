// nmp install dotenv cors 
//npm install @types/cors
import * as dotenv from 'dotenv'
import { databaseConnection } from '../database/typeorm.connection'
//Fazer a importacao do reflect-metadata
//Proximo passo eh nos fazer a conexao com o nosso banco de dados utilizando o typeorm
import 'reflect-metadata'
import { createApp } from '../config/express.config'
import { serverEnv } from '../../app/envs/server.env'
dotenv.config()

export class AppRun {
    public static async run() {
        const app = createApp()

        //Aqui nos vamos estar iniciando a nossa conexao com o banco de dados sempre que rodarmos a API

        databaseConnection.connect().then (() => {
            app.listen(serverEnv.port, () => {
                console.log (`API esta rodando na porta ${serverEnv.port}`)
            })
        })
            }
}

