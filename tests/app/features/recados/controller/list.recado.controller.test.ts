import { listRecadosUsecase } from "../../../../../src/app/features/recados/usecase/list.recados.usecase";
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

describe("List Recado controller", () => {
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

        const res = await request(app).get("/user/123/recados").set('Authorization', token).send()

        expect(res).toBeDefined();
        expect(res).toHaveProperty("statusCode", 404);
        expect(res).toHaveProperty("body.message", "Usuario nao encontrado");
        expect(res).toHaveProperty("ok");
        expect(res.ok).toBeFalsy();
    })

    test("Deveria retornar 200 se os recados forem listados com sucesso.", async () => {
        const User = new user("any_username", "any_email", "any_password")
        const Recado = new Recados("any_descricao", "any_conteudo")
        const Recado2 = new Recados("any_descricao", "any_conteudo")
        
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(null)
        
        await createUser(User)
        await createRecado(User, Recado)
        await createRecado(User, Recado2)

        const token = jwtAdapter.createToken(User);

        const res = await request(app).get(`/user/${User.id}/recados`).set('Authorization', token).send().expect(200)

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(200)

        expect(res.body.data).toHaveLength(2);
        expect(res).toBeDefined();
        expect(res).toBeTruthy();
        expect(res.body.message).toEqual("Recados listados com sucesso");
    })

    test("Deveria retornar status 500 quando gerar exceção.", async () => {
        const User = new user("any_username", "any_email", "any_password")

        await createUser(User)

        const token = jwtAdapter.createToken(User);

        jest.spyOn(listRecadosUsecase.prototype, "execute").mockImplementation(() => {
          throw new Error("Erro simulado");
        });
    
        const res = await request(app).get("/user/123/recados").set('Authorization', token).send();
    
        expect(res).toBeDefined();
        expect(res).toHaveProperty("statusCode");
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toEqual("Error: Erro simulado");
      });
})