import { response } from "express";
import { user } from "../../../../../src/app/models/user.models";
import { userEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { jwtAdapter } from "../../../../../src/app/shared/utils/jwtadapter";
import { createApp } from "../../../../../src/main/config/express.config";
import { redisConnection } from "../../../../../src/main/database/redis.connection";
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest"
import { loginUsecase } from "../../../../../src/app/features/login/usecase/login.usecase";

describe("Login User controller", () => {
    beforeAll(async () => {
        await databaseConnection.connect();
        await redisConnection.connect();
    });

    afterAll(async () => {
        await databaseConnection.connection.destroy();
        await redisConnection.connection.quit();
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.resetAllMocks();

        await databaseConnection.connection
            .getRepository(userEntity)
            .clear();
    });

    const createUser = async (User: user) => {
        await databaseConnection.connection.getRepository(userEntity).create({
            id: User.id,
            username: User.username,
            email: User.email,
            password: User.password
        }).save();
    }

    const app = createApp()

    test("Deveria retornar 401 se o token nao for informado", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const res = await request(app).get(`/user/${User.id}/recados`).set("Authorization", "").send()

        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            ok: false,
            message: "O token nao foi informado",
        });
    })

    test("Deveria seguir o fluxo se o token for valido", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const token = jwtAdapter.createToken(User);

        const res = await request(app).get(`/user/${User.id}/recados`).set("Authorization", token).send()

        expect(res.status).toBe(200);
    })

    test('Deveria retornar 500 em caso de erro no servidor', async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const token = jwtAdapter.createToken(User);

        jest.spyOn(jwtAdapter, 'checkToken').mockImplementation(() => {
          throw new Error('Erro simulado');
        });
    
        const response = await request(app).get('/user/123/recados').set('Authorization', token);
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
          ok: false,
          message: 'Error: Erro simulado',
        });
    });

    test("Deveria retornar 403 se o email ou password estiverem incorretos", async () => {
        const User = new user("any_username", "any_email", "any_password");

        await createUser(User);

        const res = await request(app).post("/auth").send({
            email: "email",
            password: "password",
        }).expect(403);

        expect(res).toBeDefined();
        expect(res.statusCode).toBe(403);
        expect(res.body).toEqual({
            ok: false, 
            code: 403,
            message: "Email/Senha incorretos!"
        })
    })

    test("Deveria retornar 200 se o login for efetuado com sucesso.", async () => {
        const User = new user("any_username", "any_email", "any_password");

        await createUser(User);

        const res = await request(app).post("/auth").send({
            email: User.email,
            password: User.password,
        }).expect(200);

        expect(res).toBeDefined();
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            ok: true,
            code: 200,
            message: "Login efetuado com sucesso!",
            data: {
                _id: expect.any(String),
                _username: "any_username",
                _email: "any_email",
                _password: "any_password",
                _recados: [],
                token: expect.any(String),
            },
        });
    })

    test("Deveria retornar 500 no caso de erro do servidor.", async () => {
        jest.spyOn(loginUsecase.prototype, 'execute').mockImplementation(() => {
            throw new Error('Erro simulado');
          });
      
          const res = await request(app)
            .post('/auth').send({
              email: 'any_email',
              password: 'any_password',
            });
      
          expect(res.status).toBe(500);
          expect(res.body).toEqual({
            ok: false,
            message: 'Error: Erro simulado',
          });
    })
})