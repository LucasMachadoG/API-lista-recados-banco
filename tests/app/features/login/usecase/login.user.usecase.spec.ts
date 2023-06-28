import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository"
import { user } from "../../../../../src/app/models/user.models"
import { redisConnection } from "../../../../../src/main/database/redis.connection"
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection"
import { loginUsecase } from "../../../../../src/app/features/login/usecase/login.usecase"

describe("Login User usecase", () => {
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

        return new loginUsecase(database)
    }

    test("Deveria retornar 403 se o email/password estiverem incorretos.", async () => {
        jest.spyOn(userDatabase.prototype, "getByEmailLogin").mockResolvedValue(null)

        const sut = makesut()

        const result = await sut.execute({email: "", password: ""})

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", false);
        expect(result).toHaveProperty("code", 403);
        expect(result).toHaveProperty("message", "Email/Senha incorretos!");
    })

    test("Deveria retornar 200 se o login for efetuado com sucesso", async () => {
        jest.spyOn(userDatabase.prototype, "getByEmailLogin").mockResolvedValue(User)

        const sut = makesut()

        const result = await sut.execute({email: "any_email", password: "any_password"})

        expect(result).toBeDefined();
        expect(result).toHaveProperty("ok", true);
        expect(result).toHaveProperty("code", 200);
        expect(result).toHaveProperty("message", "Login efetuado com sucesso!");
    })
})