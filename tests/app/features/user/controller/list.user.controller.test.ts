import { redisConnection } from "../../../../../src/main/database/redis.connection";
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/server/express.server"
import request from "supertest";
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { listUsecase } from "../../../../../src/app/features/user/usecases/list.user.usecase";
import { userEntity } from "../../../../../src/app/shared/database/entities/user.entity";

const Users = async () => {
    const repository = databaseConnection.connection.getRepository(userEntity)
    
    const user1 = await repository.create({
        id: "any_id",
        username: "username1",
        email: "email1",
        password: "password1"
    }).save()
    
    const user2 = await repository.create({
        id: "any_id",
        username: "username2",
        email: "email2",
        password: "password2"
    }).save()

    return [user1, user2]
}


describe("List User controller", () => {
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

    const app = createApp()
    
    test("Deveria retornar 200 e uma lista de usuarios.", async () => {
        await Users()
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(null)

        const res = await request(app).get("/user").send().expect(200)

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(200)

        expect(res).toBeDefined();
        expect(res).toBeTruthy();
        expect(res.body.message).toEqual("Usuarios listados com sucesso!");
    })

    test("Deveria retornar status 500 quando gerar exceção.", async () => {
        jest.spyOn(listUsecase.prototype, "execute").mockImplementation(() => {
          throw new Error("Erro simulado");
        });
    
        const res = await request(app).get("/user").send();
    
        expect(res).toBeDefined();
        expect(res).toHaveProperty("statusCode");
        expect(res.statusCode).toBe(500);
        expect(res.body.message).toEqual("Error: Erro simulado");
      });
})