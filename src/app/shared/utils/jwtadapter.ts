import  Jwt  from "jsonwebtoken"
import { authEnv } from "../../envs/auth.env"

// const inactivityTimeout = 30 * 60
// { expiresIn: inactivityTimeout }

export class jwtAdapter {
    public static createToken (data: any){
        
        // return Jwt.sign(data, authEnv.secret!, { expiresIn: `${expiresInMinutes}m` });

        return Jwt.sign(JSON.stringify(data), authEnv.secret!)
    }   

    public static checkToken (token: string) {
        return Jwt.verify(token, authEnv.secret!)
    }
}

