import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository"
import { getUserUsecase } from "../../../../../src/app/features/user/usecases/get.user.usecase"
import { user } from "../../../../../src/app/models/user.models"
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository"
import { redisConnection } from "../../../../../src/main/database/redis.connection"
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection"

describe("Get User usecase", () => {
    beforeAll(async () => {
        await databaseConnection.connect()
        await redisConnection.connect()
    })

    afterAll(async () => {
        await databaseConnection.connection.destroy()
        await redisConnection.connection.quit()
    })

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    const User = new user(
        "any_username",
        "any_email",
        "any_password"
    )

    const makesut = () => {
        const database = new userDatabase()
        const cache = new cacheRepository()

        return new getUserUsecase(database, cache)
    }

    test("Deveria retornar 400 caso o ID do usuario nao seja encontrado.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(null)

        const sut = makesut()

        const result = await sut.execute("any_id")

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("code", 404);
        expect(result).toHaveProperty("message", "Usuario nao encontrado");
    })

    test("Deveria retornar 200 se o usuario for listado com sucesso.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(User)
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(null)

        const sut = makesut()

        const result = await sut.execute(User.id)

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 200);
        expect(result.message).toEqual("Usuario listado com sucesso");
        expect(result).toBeTruthy();
        expect(result).toHaveProperty("data");
    })

    test("Deveria retornar 200 se o usuario for listado em cache.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(null)
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(User)

        const sut = makesut()

        const result = await sut.execute(User.id)

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 200);
        expect(result.message).toEqual("Usuario listado com sucesso! Cache");
        expect(result).toBeTruthy();
        expect(result).toHaveProperty("data");
    })
})