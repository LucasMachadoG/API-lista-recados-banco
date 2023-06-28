import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository"
import { updateUserUsecase } from "../../../../../src/app/features/user/usecases/update.user.usecase"
import { user } from "../../../../../src/app/models/user.models"
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository"
import { redisConnection } from "../../../../../src/main/database/redis.connection"
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection"

describe("Update User usecase", () => {
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
    })

    const User = new user(
        "any_username",
        "any_email",
        "any_password"
    )

    const makesut = () => {
        const database = new userDatabase()
        const cache = new cacheRepository()

        return new updateUserUsecase(database, cache)
    }

    test("Deveria retornar 400 se ja existir alguem com aquele email cadastrado.", async () => {
        jest.spyOn(userDatabase.prototype, "getByEmail").mockResolvedValue(User)

        const sut = makesut()

        const result = await sut.execute({id: "any_id"})

        expect(result).toBeDefined()
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("code", 400);
        expect(result).toHaveProperty("message", "Ja existe alguem cadastrado com esse email");
    })

    test("Deveria retornar 404 se nao encontrar o usuario.", async () => {
        jest.spyOn(userDatabase.prototype, "getByEmail").mockResolvedValue(null)
        jest.spyOn(userDatabase.prototype, "update").mockResolvedValue(0)

        const sut = makesut()

        const result = await sut.execute({id: "any_id"})

        expect(result).toBeDefined()
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("code", 404);
        expect(result).toHaveProperty("message", "Usuario nao encontrado");
    })

    test("Deveria retornar 200 se o usuario for atualizado com sucesso.", async () => {
        jest.spyOn(userDatabase.prototype, "getByEmail").mockResolvedValue(null)
        jest.spyOn(userDatabase.prototype, "update").mockResolvedValue(1)

        const sut = makesut()

        const result = await sut.execute({id: "any_id"})

        expect(result).toBeDefined()
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 200);
        expect(result).toHaveProperty("message", "Usuario atualizado com sucesso");
    })

    test("Deveria excluir as chaves de usuários no cache.", async () => {
        const cacheKeys = ["users:1", "users:2", "users:3"];
      
        jest.spyOn(cacheRepository.prototype, "keys").mockResolvedValue(cacheKeys);
        jest.spyOn(cacheRepository.prototype, "delete").mockResolvedValue(true);
      
        const sut = makesut()
      
        await sut.deleteUsersCacheKeys();
      
        expect(cacheRepository.prototype.keys).toHaveBeenCalledTimes(1);
      
        expect(cacheRepository.prototype.delete).toHaveBeenCalledTimes(cacheKeys.length);
        expect(cacheRepository.prototype.delete).toHaveBeenNthCalledWith(1, "users:1");
        expect(cacheRepository.prototype.delete).toHaveBeenNthCalledWith(2, "users:2");
        expect(cacheRepository.prototype.delete).toHaveBeenNthCalledWith(3, "users:3");
      }); 
})