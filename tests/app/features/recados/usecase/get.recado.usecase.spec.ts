import { RecadoRepository } from "../../../../../src/app/features/recados/database/recado.repository"
import { getRecadosUsecase } from "../../../../../src/app/features/recados/usecase/get.recados.usecase"
import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository"
import { Recados } from "../../../../../src/app/models/recados.model"
import { user } from "../../../../../src/app/models/user.models"
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository"
import { redisConnection } from "../../../../../src/main/database/redis.connection"
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection"

describe("Get Recado usecase", () => {
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

    const recado = new Recados(
        "any_descricao",
        "any_conteudo"
    )

    const User = new user(
        "any_username",
        "any_email",
        "any_password"
    ) 

    const makesut = () => {
        const database = new RecadoRepository()
        const UserDatabase = new userDatabase()
        const cache = new cacheRepository()

        return new getRecadosUsecase(database, UserDatabase, cache)
    }

    test("Deveria retornar 404 se o usuario nao for encontrado.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(null)

        const sut = makesut()

        const result = await sut.execute({userId: "any_userId", id: "any_id"})

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("code", 404);
        expect(result).toHaveProperty("message", "Usuario nao encontrado");
    })

    test("Deveria retornar 200 se o recado for listado com sucesso.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(User)
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(null)

        jest.spyOn(RecadoRepository.prototype, "get").mockResolvedValue(recado)

        const sut = makesut()

        const result = await sut.execute({userId: User.id, id: recado.id})

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 200);
        expect(result.message).toEqual("Recado listado com sucesso");
        expect(result).toBeTruthy();
        expect(result).toHaveProperty("data");
    })

    test("Deveria retornar 200 se o recado for listado com sucesso em cache.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(User)
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(recado)
        jest.spyOn(RecadoRepository.prototype, "get").mockResolvedValue(null)

        const sut = makesut()

        const result = await sut.execute({userId: User.id, id: recado.id})

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 200);
        expect(result.message).toEqual("Recado listado com sucesso (cache)");
        expect(result).toBeTruthy();
        expect(result).toHaveProperty("data");
    })
})