import { updateRecadosUsecase } from "../../../../../src/app/features/recados/usecase/update.recados.usecase";
import { Recados } from "../../../../../src/app/models/recados.model";
import { user } from "../../../../../src/app/models/user.models";
import { RecadoEntity } from "../../../../../src/app/shared/database/entities/recados.entity";
import { userEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { jwtAdapter } from "../../../../../src/app/shared/utils/jwtadapter";
import { createApp } from "../../../../../src/main/config/express.config";
import { redisConnection } from "../../../../../src/main/database/redis.connection";
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";

describe("Update Recado controller", () => {
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

    const createUser = async (User: user) => {
        await databaseConnection.connection.getRepository(userEntity).create({
            id: User.id,
            username: User.username,
            email: User.email,
            password: User.password
        }).save();
    }

    const createRecado = async (User: user, recado: Recados) => {
        await databaseConnection.connection.getRepository(RecadoEntity).create({
            id: recado.id,
            descricao: recado.descricao,
            conteudo: recado.conteudo,
            user: {
                id: User.id
            }
        }).save()
    }

    const app = createApp()

    test("Deveria retornar 404 se o usuario nao for encontrado.", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const token = jwtAdapter.createToken(User);

        const res = await request(app).put("/user/123/recados/123").set('Authorization', token).send()

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(404)

        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty("ok", false)
        expect(res.body).toHaveProperty("message", "Usuario nao encontrado")
    })

    test("Deveria retornar 404 se o recado nao for encontrado.", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const token = jwtAdapter.createToken(User);

        const res = await request(app).put(`/user/${User.id}/recados/123`).set('Authorization', token).send()

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(404)

        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty("ok", false)
        expect(res.body).toHaveProperty("message", "Recado nao encontrado")
    })

    test("Deveria retornar 200 se o recado for atulizado com sucesso.", async () => {
        const User = new user("any_username", "any_email", "any_password")
        const Recado = new Recados("any_descricao", "any_conteudo")

        await createUser(User)
        await createRecado(User, Recado)

        const token = jwtAdapter.createToken(User);

        const updateRecado = {
            descricao: "new_descricao"
        }

        const res = await request(app).put(`/user/${User.id}/recados/${Recado.id}`).set('Authorization', token).send(updateRecado).expect(200)

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(200)

        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty("ok", true)
        expect(res.body).toHaveProperty("message", "Recado atualizado com sucesso")
    })

    test("Deveria retornar status 500 quando gerar exceção.", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const token = jwtAdapter.createToken(User);

        jest.spyOn(updateRecadosUsecase.prototype, "execute").mockImplementation(() => {
          throw new Error("Erro simulado");
        });
    
        const res = await request(app).put("/user/123/recados/123").set('Authorization', token).send();
    
        expect(res).toBeDefined();
        expect(res).toHaveProperty("statusCode");
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toEqual("Error: Erro simulado");
      });
})