import { RecadoRepository } from "../../../../../src/app/features/recados/database/recado.repository"
import { listRecadosUsecase } from "../../../../../src/app/features/recados/usecase/list.recados.usecase"
import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository"
import { Recados } from "../../../../../src/app/models/recados.model"
import { user } from "../../../../../src/app/models/user.models"
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository"
import { redisConnection } from "../../../../../src/main/database/redis.connection"
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection"

describe("List Recados usecase", () => {
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

    const recado = new Recados(
        "any_descricao",
        "any_conteudo"
    )
       
    const makesut = () => {
        const database = new RecadoRepository()
        const UserDatabase = new userDatabase()
        const cache = new cacheRepository()

        return new listRecadosUsecase(database, UserDatabase, cache)
    }

    test("Deveria retornar 400 se o usuario nao for encontrado.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(null)

        const sut = makesut()

        const result = await sut.execute("any_id")

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("code", 404);
        expect(result).toHaveProperty("message", "Usuario nao encontrado");
    })

    test("Deveria retornar 200 se todos os recados forem listados.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(User)
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue(null)

        jest.spyOn(RecadoRepository.prototype, "list").mockResolvedValue([recado, recado])

        const sut = makesut()

        const result = await sut.execute("any_id")

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 200);
        expect(result).toHaveProperty("message", "Recados listados com sucesso");
        expect(result).toHaveProperty("data")
        expect(result).toBeTruthy();
    })

    test("Deveria retornar 200 se listar os recados em cache.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(User)
        jest.spyOn(cacheRepository.prototype, "get").mockResolvedValue([recado, recado])

        jest.spyOn(RecadoRepository.prototype, "list").mockResolvedValue([])

        const sut = makesut()

        const result = await sut.execute("any_id")

        expect(cacheRepository.prototype.get).toHaveBeenCalled()
        expect(RecadoRepository.prototype.list).not.toBeCalled()
        expect(result).toEqual({
            ok: true,
            code: 200,
            message: "Recados listados com sucesso (Cache)",
            data: [recado, recado],
        })
    })
})