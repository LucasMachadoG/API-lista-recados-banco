import { Response } from "superagent";
import { Recados } from "../../../../../src/app/models/recados.model";
import { user } from "../../../../../src/app/models/user.models";
import { RecadoEntity } from "../../../../../src/app/shared/database/entities/recados.entity";
import { userEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { redisConnection } from "../../../../../src/main/database/redis.connection";
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";
import { createRecadosUsecase } from "../../../../../src/app/features/recados/usecase/create.recados.usecase";
import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository";
import { jwtAdapter } from "../../../../../src/app/shared/utils/jwtadapter";

describe("Create Recado controller", () => {
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
            .getRepository(RecadoEntity)
            .clear();
        await databaseConnection.connection
        .getRepository(userEntity)
        .clear();
    });

    const checkFieldNotProvided = (res: any, field: string) => {
        expect(res).toBeDefined();
        expect(res).toHaveProperty("statusCode", 400);
        expect(res).toHaveProperty("body.message", `${field} nao foi informado`);
    };

    const createUser = async (User: user) => {
        await databaseConnection.connection.getRepository(userEntity).create({
            id: User.id,
            username: User.username,
            email: User.email,
            password: User.password
        }).save();
    }

    const app = createApp()

    test("Deveria retornar 404 se o usuario nao for encontrado.", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const token = jwtAdapter.createToken(User);
        const res = await request(app).get("/user/123/recados/123").set('Authorization', token).send()

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(404)

        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty("ok", false)
        expect(res.body).toHaveProperty("message", "Usuario nao encontrado")
    })

    test("Deveria retornar 400 se a descricao nao for informado", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const res = await request(app).post(`/user/${User.id}/recados`).send({
            descricao: "",
            conteudo: ""
        })

        checkFieldNotProvided(res, "Descricao")
    })

    test("Deveria retornar 400 se o conteudo nao for informado", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const res = await request(app).post(`/user/${User.id}/recados`).send({
            descricao: "any_username",
            conteudo: ""
        })

        checkFieldNotProvided(res, "Conteudo")
    })

    test("Deveria retornar 201 se o recado for criado com sucesso.", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const token = jwtAdapter.createToken(User);

        const res = await request(app).post(`/user/${User.id}/recados`).set('Authorization', token).send({
            descricao: "any_descricao",
            conteudo: "any_conteudo"
        }).expect(201)

        expect(res).toBeDefined();
        expect(res).toBeTruthy();
        expect(res.body.message).toEqual("Recado criado com sucesso");
    })

    test("Deveria retornar status 500 se gerar exceção. ", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const token = jwtAdapter.createToken(User);

        jest.spyOn(createRecadosUsecase.prototype, "execute").mockImplementation((_) => {
            throw new Error("Erro simulado");
        });
        const res = await request(app).post("/user/123/recados").set('Authorization', token).send({ 
            descricao: "any_descricao",
            conteudo: "any_conteudo"
        }).expect(500);
    
        expect(res).toBeDefined();
        expect(res.statusCode).toBe(500);
        expect(res).toHaveProperty(
            "body.message",
            "Error: Erro simulado"
        );
      });
})

