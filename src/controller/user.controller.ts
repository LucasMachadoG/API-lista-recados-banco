import { Request ,Response } from "express";
import { userDatabase } from "../database/user.database";
import { requestError } from "../errors/request.error";
import { serverError } from "../errors/serverError";
import { user } from "../models/user.models";

export class userController {
    public async list (req: Request, res: Response) {
        try {
            const database = new userDatabase()
            const users = await database.list()

            // const result = users.map((user) => user.toJason())

            return res.status(200).send({
                ok: false,
                message: "Users successfully listed",
                data: users
            })
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public get (req: Request, res: Response) {
        try {
            const { id } = req.params

            const database = new userDatabase()
            const user = database.get(id)

            if (!user) {
                return requestError.notFoundError(res, "User")
            }

            return res.status(200).send({
                ok: true ,
                message: "User successfully obtained",
                data: user
            })
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public create (req: Request, res: Response) {
        try {
            const { username, email, password } = req.body 

            if (!username) {
                return requestError.fieldNotProvider(res, "Username")
            }

            if (!email) {
                return requestError.fieldNotProvider(res, "Email")
            }

            if (!password) {
                return requestError.fieldNotProvider(res, "Password")
            }

            const User = new user (username, email, password)

            const database = new userDatabase()
            database.create(User)

            return res.status(200).send({
                ok: true, 
                message: "User successfully created!",
                data: User
            })

        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public delete (req: Request, res: Response) {
        try {
            const { id } = req.params

            const database = new userDatabase()
            const userIndex = database.getIndex(id)
            //Captacao do usuario pelo id para poder mostrar qual usuario foi deletado
            const user = database.get(id)

            if (!user) {
                return requestError.notFoundError(res, "User")
            }

            database.delete(userIndex)

            return res.status(200).send({
                ok: true,
                message: "User successfully deleted!",
                data: user.toJason()
            })
            
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public update (req: Request, res: Response) {
        try {
            const { id } = req.params
            const {  username, email, password} = req.body

            const database = new userDatabase()
            const user = database.get(id)

            if (!user) {
                return requestError.notFoundError(res, "User")
            }

            if (username) {
                user.username = username
            }

            if (email) {
                user.email = email
            }

            if (password) {
                user.password = password
            }

            return res.status(200).send({
                ok: true, 
                message: "User successfully updated!"
            })
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }

    public loginValida (req: Request, res: Response) {
        try {
            const { email, password } = req.body

            if (!email) {
                return requestError.fieldNotProvider(res, "Email")
            }

            if (!password) {
                return requestError.fieldNotProvider(res, "Password")
            }

            const database = new userDatabase
            const user = database.getByEmail(email)

            if (!user) {
                return res.status(401).send({
                    ok: false,
                    message: ""
                })
            }

            if (user.password !== password) {
                return res.status(403).send({
                    ok: false, 
                    message: ""
                })
            }

            return res.status(200).send({
                ok: true,
                message: "",
                id: user.id
            })
        } catch (error: any) {
            return serverError.genericError(res, error)
        }
    }   
    
}