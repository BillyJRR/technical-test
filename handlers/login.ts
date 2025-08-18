import { DynamoUserRepository } from "../src/infrastructure/database/DynamoUserRepository";
import { JwtService } from "../src/infrastructure/security/JwtService";
import { LoginUser } from "../src/application/login/LoginUser";
import { LoginController } from "../src/interfaces/login/LoginController";

const userRepository = new DynamoUserRepository();
const jwtService = new JwtService();
const loginUser = new LoginUser(userRepository, jwtService);
const loginController = new LoginController(loginUser);

export const handler = async (event: any) => {
    return await loginController.handle(event);
};
