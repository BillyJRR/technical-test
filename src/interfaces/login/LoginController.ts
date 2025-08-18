import { LoginUser } from "../../application/login/LoginUser";
import { validateEmail } from "../../utils/validator";
import { buildResponse } from "../../utils/response";

export class LoginController {
    constructor(private LoginUser: LoginUser) { }

    async handle(event: any) {
        try {
            const body = JSON.parse(event.body || "{}");
            const { email, password } = body;

            if (!validateEmail(email)) {
                return buildResponse(400, { message: "Invalid email format" });
            }

            if (!password) {
                return buildResponse(400, { message: "Password is required" });
            }
            const loginData = await this.LoginUser.execute(email, password);
            if (!loginData) {
                return buildResponse(401, { message: "Invalid credentials" });
            }

            return buildResponse(200, { message: "Successful login", token: loginData.token, user: loginData.user, insured: loginData.insured });
        } catch (error) {
            return buildResponse(500, { message: "Internal Server Error", error });
        }
    }
}
