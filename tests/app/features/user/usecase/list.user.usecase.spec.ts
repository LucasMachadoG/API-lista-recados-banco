import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository";
import { listUsecase } from "../../../../../src/app/features/user/usecases/list.user.usecase";
import { listUserUsecaseFactory } from "../../../../../src/app/features/user/util/user.usecase.factory";
import { user } from "../../../../../src/app/models/user.models";
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { redisConnection } from "../../../../../src/main/database/redis.connection";
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection";

describe("List User usecase", () => {
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

    const makesut = () => {
        const database = new userDatabase()
        const cache = new cacheRepository()
        return new listUsecase(database, cache)
    }

    const User = new user(
        "any_username",
        "any_email",
        "any_password"
    )

    test("Deveria retornar 200 se todos os usuarios forem listados.", async () => {
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(null)

        jest.spyOn(userDatabase.prototype, "list").mockResolvedValue([User, User])

        const sut = makesut()

        const result = await sut.execute({username: "", email: ""})

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 200);
        expect(result).toHaveProperty("message", "Usuarios listados com sucesso!");
        expect(result).toHaveProperty("data");
        expect(result.data).toHaveLength(2);
    })

    test('Deveria retornar 200 se listar os usuarios em cache.', async () => {
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue([User, User])
        jest.spyOn(cacheRepository.prototype, "set").mockResolvedValue(true)

        jest.spyOn(userDatabase.prototype, "list").mockResolvedValue([])

        const sut = makesut()

        const result = await sut.execute({username: "", email: ""})

        expect(cacheRepository.prototype.get).toHaveBeenCalled()
        expect(userDatabase.prototype.list).not.toBeCalled()
        expect(result).toEqual({
            ok: true,
            code: 200,
            message: "Usuarios listados com sucesso! Cache",
            data: [User, User],
        })
    })
})