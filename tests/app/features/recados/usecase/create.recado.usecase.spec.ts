import { RecadoRepository } from "../../../../../src/app/features/recados/database/recado.repository"
import { createRecadosUsecase } from "../../../../../src/app/features/recados/usecase/create.recados.usecase"
import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository"
import { Recados } from "../../../../../src/app/models/recados.model"
import { user } from "../../../../../src/app/models/user.models"
import { cacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository"
import { redisConnection } from "../../../../../src/main/database/redis.connection"
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection"

describe("Create Recado usecase", () => {
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

        return new createRecadosUsecase(database, UserDatabase, cache)
    }

    test("Deveria retornar 404 se o usuario nao for encontrado", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(null)

        const sut = makesut()

        const result = await sut.execute({
            id: "any_id",
            descricao: "any_descricao",
            conteudo: "any_conteudo"
        })

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("code", 404);
        expect(result).toHaveProperty("message", "Usuario nao encontrado");
    })

    test("Deveria retornar 200 se o recado for criado com sucesso.", async () => {
        jest.spyOn(userDatabase.prototype, "get").mockResolvedValue(User)
        jest.spyOn(RecadoRepository.prototype, "create").mockResolvedValue(recado)

        const sut = makesut()

        const result = await sut.execute(recado)

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 201);
        expect(result.message).toEqual("Recado criado com sucesso");
        expect(result).toHaveProperty("data");
        expect(result.data.id).toHaveLength(36);
    })

    test("Deveria excluir as chaves de recados no cache.", async () => {
        const cacheKeys = ["recados:1", "recados:2", "recados:3"];
      
        jest.spyOn(cacheRepository.prototype, "keys").mockResolvedValue(cacheKeys);
        jest.spyOn(cacheRepository.prototype, "delete").mockResolvedValue(true);
      
        const sut = makesut()
      
        await sut.deleteUsersCacheKeys();
      
        expect(cacheRepository.prototype.keys).toHaveBeenCalledTimes(1);
      
        expect(cacheRepository.prototype.delete).toHaveBeenCalledTimes(cacheKeys.length);
        expect(cacheRepository.prototype.delete).toHaveBeenNthCalledWith(1, "recados:1");
        expect(cacheRepository.prototype.delete).toHaveBeenNthCalledWith(2, "recados:2");
        expect(cacheRepository.prototype.delete).toHaveBeenNthCalledWith(3, "recados:3");
      });  
})