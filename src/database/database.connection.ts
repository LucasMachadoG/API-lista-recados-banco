//Aqui nos vamos a conexao do nosso back end com o nosso banco de dados
import { PoolClient } from 'pg'
import config from './database.config'

export class databaseConnection {
    private static _connection: PoolClient; 

    public static async connect () {
        //Nos podemos ver que esse connect retorna uma promisse, ou seja, a conexao com o banco de dados ela eh assinc
        //Esse config vem do pool
        //O connect me retorna a referencia desse conexao e quando nos fizer a conexao nos queremos gravar essa referemcia em um campo
        //para que depois a gente possa usar essa referencia
        this._connection =  await config.connect()
        console.log ("Database connected")
    }

    public static get connection () {
        return this._connection
    }
}