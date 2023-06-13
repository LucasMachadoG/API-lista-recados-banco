import { user } from "../models/user.models";
import { databaseConnection } from "./database.connection";
import { users } from "./users";

export class userDatabase {
    public async list () {
        const result = await databaseConnection.connection.query("select * from trabalho.user")

        return result.rows
    }
    
    public get (id: string) {
        return users.find ((user) => user.id === id)
    }

    public create (user: user) {
        users.push (user)
    }

    public getIndex (id: string) {
        return users.findIndex ((user) => user.id === id)
    }

    public delete (index: number) {
        users.splice (index, 1)
    }

    public getByEmail (email: string) {
        return users.find ((user) => user.email === email)
    }
}