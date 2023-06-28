import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository"
import { deleteUserUsecase } from "../../../../../src/app/features/user/usecases/delete.user.usecase"
import { user } from "../../../../../src/app/models/user.models"
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository"
import { redisConnection } from "../../../../../src/main/database/redis.connection"
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection"

describe("Delete User usecase", () => {
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

    const makesut = () => {
        const database = new userDatabase()
        const cache = new cacheRepository()

        return new deleteUserUsecase(database, cache)
    }

    test("Deveria retornar 404 se o usuario nao for encontrado", async () => {
        jest.spyOn(userDatabase.prototype, "delete").mockResolvedValue(0)

        const sut = makesut()

        const result = await sut.execute("any_id")

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("code", 404);
        expect(result).toHaveProperty("message", "Usuario nao encontrado");
    })

    test("Deveria retornar 200 se o usuario for deletado com sucesso", async () => {
        jest.spyOn(userDatabase.prototype, "delete").mockResolvedValue(1)

        const sut = makesut()
        
        const result = await sut.execute("any_id")

         
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