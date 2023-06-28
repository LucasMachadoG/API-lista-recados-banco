import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository";
import { updateUserUsecase } from "../../../../../src/app/features/user/usecases/update.user.usecase";
import { user } from "../../../../../src/app/models/user.models";
import { userEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { redisConnection } from "../../../../../src/main/database/redis.connection";
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";

describe("Update User controller", () => {
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

    test("Deveria retornar 404 se o usuario nao for encontrado.", async () => {
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(null)

        const res = await request(app).put("/user/123").send()

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(404)

        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty("ok", false)
        expect(res.body).toHaveProperty("message", "Usuario nao encontrado")
    })

    test("Deveria retornar 200 se o usuario for atualizado com sucesso.", async () => {
        const User = new user("any_username", "any_email", "any_password")

        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(null)
        jest.spyOn(userDatabase.prototype, "getByEmail").mockResolvedValue(null)

        await createUser(User)

        const updateUser = {
            username: "new_username"
        }

        const res = await request(app).put(`/user/${User.id}`).send(updateUser).expect(200)

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(200)

        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty("ok", true)
        expect(res.body).toHaveProperty("message", "Usuario atualizado com sucesso")
    })

    test("Deveria retornar status 500 quando gerar exceção.", async () => {
        jest.spyOn(updateUserUsecase.prototype, "execute").mockImplementation(() => {
          throw new Error("Erro simulado");
        });
    
        const res = await request(app).put("/user/123").send();
    
        expect(res).toBeDefined();
        expect(res).toHaveProperty("statusCode");
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toEqual("Error: Erro simulado");
      });
})