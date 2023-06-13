import { v4 as createUuid } from "uuid"
import { Recados } from "./recados.model"

export class user {
    private _id: string

    constructor (
        private _username: string,
        private _email: string,
        private _password: string,
        private _recados?: Recados []

    ) {
        this._id = createUuid ()
    }

    public get id () {
        return this._id
    }

    public get recados () {
        return this._recados
    }

    public get username () {
        return this._username
    }

    public get email () {
        return this._email
    }

    public get password () {
        return this._password
    }

    public set username (username: string) {
        this._username = username
    }

    public set email (email: string) {
        this._email = email
    }

    public set password (password: string) {
        this._password = password
    }

    public toJason () {
        return {
            id: this._id,
            username: this._username,
            email: this._email,
            recados: this._recados
        }
    }

    public static create (id: string, username: string, email: string, password: string, recados: Recados []) {
        const User = new user(username, email, password, recados)

        User._id = id

        return User
    }
}