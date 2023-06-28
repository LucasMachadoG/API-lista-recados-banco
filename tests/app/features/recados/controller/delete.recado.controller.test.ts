import { deleteRecadosUsecase } from "../../../../../src/app/features/recados/usecase/delete.recados.usecase";
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

describe("Delete Recado controller", () => {
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

        const res = await request(app).delete("/user/123/recados/123").set('Authorization', token).send()

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

        const res = await request(app).delete(`/user/${User.id}/recados/123`).set('Authorization', token).send()

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(404)

        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty("ok", false)
        expect(res.body).toHaveProperty("message", "Recado nao encontrado")
    })

    test("Deveria retornar 200 se o recado for deletado com sucesso.", async () => {
        const User = new user("any_username", "any_email", "any_password")
        const Recado = new Recados("any_descricao", "any_conteudo")

        await createUser(User)
        await createRecado(User, Recado)

        const token = jwtAdapter.createToken(User);

        const res = await request(app).delete(`/user/${User.id}/recados/${Recado.id}`).set('Authorization', token).send().expect(200)

        expect(res).toBeDefined();
        expect(res).toBeTruthy();
        expect(res.body.message).toEqual("Recado deletado com sucesso");
        expect(res.body.data).toEqual(Recado.id)
    })

    test("Deveria retornar 500 se o repository virar exceção", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)
        const token = jwtAdapter.createToken(User);
        jest.spyOn(deleteRecadosUsecase.prototype, "execute").mockImplementation(() => {
            throw new Error("Erro simulado");
          });
      
        const result = await request(app).delete(`/user/123/recados/123`).set('Authorization', token).send();
      
        expect(result).toBeDefined();
        expect(result.statusCode).toBe(500);
      
        expect(result.body).toBeDefined();
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Error: Erro simulado");
      });
})