import * as dotenv from 'dotenv'
import { databaseConnection } from '../database/typeorm.connection'
import 'reflect-metadata'
import { createApp } from '../config/express.config'
import { serverEnv } from '../../app/envs/server.env'
import { redisConnection } from '../database/redis.connection'
import { Express } from 'express'

dotenv.config()

export class AppRun {
    private static app: Express

    public static async run() {
        AppRun.app = createApp()

        // Promise all vai fazer a conexao dos dois juntos
        Promise.all([databaseConnection.connect(), redisConnection.connect()])
        .then(this.listen)
    }

    private static listen() {
        AppRun.app.listen(serverEnv.port, () => {
            console.log (`API esta rodando na porta (${process.env.PORT})`)
        })
    }
}

