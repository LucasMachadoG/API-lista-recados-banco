import { deleteUserUsecase } from "../../../../../src/app/features/user/usecases/delete.user.usecase";
import { user } from "../../../../../src/app/models/user.models";
import { userEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { createApp } from "../../../../../src/main/config/express.config";
import { redisConnection } from "../../../../../src/main/database/redis.connection";
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest"

describe("Delete User controller", () => {
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

        const res = await request(app).delete("/user/123").send()

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(404)

        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty("ok", false)
        expect(res.body).toHaveProperty("message", "Usuario nao encontrado")
    })

    test("Deveria retornar 200 se o usuario for deletado com sucesso.", async () => {
        const User = new user("any_username", "any_email", "any_password")

        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(null)

        await createUser(User)

        const res = await request(app).delete(`/user/${User.id}`).send().expect(200)

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(200)

        expect(res.body).toBeDefined()
        expect(res.body).toHaveProperty("ok", true)
        expect(res.body).toHaveProperty("message", "Usuario deletado com sucesso")
    })

    test("Deveria retornar 500 se o repository virar exceção", async () => {
        jest.spyOn(deleteUserUsecase.prototype, "execute").mockImplementation(() => {
            throw new Error("Erro simulado");
          });
      
        const result = await request(app).delete(`/user/123`).send();
      
        expect(result).toBeDefined();
        expect(result.statusCode).toBe(500);
      
        expect(result.body).toBeDefined();
        expect(result.body).toHaveProperty("ok", false);
        expect(result.body).toHaveProperty("message", "Error: Erro simulado");
      });
})