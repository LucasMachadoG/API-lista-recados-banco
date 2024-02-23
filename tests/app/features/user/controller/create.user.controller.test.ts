
import { userDatabase } from "../../../../../src/app/features/user/repositories/user.repository";
import { createUserUsecase } from "../../../../../src/app/features/user/usecases/create.user.usecase";
import { userEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { redisConnection } from "../../../../../src/main/database/redis.connection";
import { databaseConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest"

describe("Create User controller", () => {
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

    const checkFieldNotProvided = (res: any, field: string) => {
        expect(res).toBeDefined();
        expect(res).toHaveProperty("statusCode", 400);
        expect(res).toHaveProperty("body.message", `${field} nao foi informado`);
    };

    test("Deveria retornar 400 se o username nao for informado", async () => {
        const res = await request(app).post("/user").send({
            username: "",
            email: "",
            password: ""
        })

        checkFieldNotProvided(res, "Username")
    })

    test("Deveria retornar 400 se o email nao for informado", async () => {
        const res = await request(app).post("/user").send({
            username: "any_username",
            email: "",
            password: ""
        })

        checkFieldNotProvided(res, "Email")
    })

    test("Deveria retornar 400 se a password nao for informada", async () => {
        const res = await request(app).post("/user").send({
            username: "any_username",
            email: "any_email",
            password: ""
        })

        checkFieldNotProvided(res, "Password")
    })

    test("Deveria retornar 200 se o usecase executar com sucesso", async () => {
        jest.spyOn(userDatabase.prototype, "getByEmail").mockResolvedValue(null)

        const res = await request(app).post("/user").send({
            username: "any_username",
            email: "any_emaill",
            password: "any_password"
        })

        expect(res).toBeDefined()
        expect(res.statusCode).toBe(200)
    });
      
    test("Deveria retornar status 500 se gerar exceção. ", async () => {
        jest.spyOn(createUserUsecase.prototype, "execute").mockImplementation((_) => {
            throw new Error("Erro simulado");
        });
        const res = await request(app).post("/user").send({ 
            username: "any_username",  
            email: "any_email", 
            password: "any_password" 
        }).expect(500);
    
        expect(res).toBeDefined();
        expect(res.statusCode).toBe(500);
        expect(res).toHaveProperty(
            "body.message",
            "Error: Erro simulado"
        );
      });
})