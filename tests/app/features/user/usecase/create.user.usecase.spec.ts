import { databaseConnection } from '../../../../../src/main/database/typeorm.connection'
import { redisConnection } from '../../../../../src/main/database/redis.connection'
import { userDatabase } from '../../../../../src/app/features/user/repositories/user.repository'
import { user } from '../../../../../src/app/models/user.models'
import { cacheRepository } from '../../../../../src/app/shared/database/repositories/cache.repository'
import {  createUserUsecase } from '../../../../../src/app/features/user/usecases/create.user.usecase'

describe("Create User usecase", () => {
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
        const databaseEmail = new userDatabase()
        const database = new userDatabase()
        const cache = new cacheRepository()

        return new createUserUsecase(databaseEmail, database, cache)
    }

    const User = {
        id: "any_id",
        username: "any_username",
        email: "any_email",
        password: "any_password"
    }

    test("Deveria retornar 400 se ja existir um usuario com esse email.", async () => {
        jest.spyOn(userDatabase.prototype, "getByEmail").mockResolvedValue(new user(User.username, User.email, User.password))

        const sut = makesut()

        const result = await sut.execute(User)

        expect(result).toBeDefined()
        expect(result).toHaveProperty("ok", false)
        expect(result).toHaveProperty("code", 400)
        expect(result).toHaveProperty("message", "Ja existe alguem com esse email cadastrado")
    })

    test("Deveria retornar 200 se o usuario for criado com sucesso.", async () => {
        jest.spyOn(userDatabase.prototype, "getByEmail").mockResolvedValue(null)

        jest.spyOn(userDatabase.prototype, "create").mockResolvedValue(new user(User.username, User.email, User.password))

        const sut = makesut()

        const result = await sut.execute(User)

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 200);
        expect(result.message).toEqual("Usuario criado com sucesso");
        expect(result).toHaveProperty("data");
        expect(result.data.id).toHaveLength(36);
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


