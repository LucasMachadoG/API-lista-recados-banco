//Arquivo de configuracao do nosso banco de dados
// import { Pool } from 'pg'
import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import { databaseEnv } from '../../app/envs/database.env'

dotenv.config()

//Com o typeorm, existem datasources para cada tipo de banco de dados
//Todo datasource precisa ter obrigatoriamente o atributo type
export default new DataSource({
    type: 'postgres',
    port: 5432,
    host: databaseEnv.host,
    username: databaseEnv.username,
    password: databaseEnv.password,
    database: databaseEnv.database,
    //Colocamos para aceitar banco de dados sem um certificado de seguranca
    ssl: {
        rejectUnauthorized: false
    },
    synchronize: false,
    entities: ['src/app/shared/database/entities/**/*.ts'],
    migrations: ['src/app/database/migrations/**/*.ts'],
    schema: "trabalho"
})
