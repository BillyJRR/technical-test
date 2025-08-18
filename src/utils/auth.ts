import { JwtService } from "../infrastructure/security/JwtService";

const jwtService = new JwtService();

export function validateToken(event: any) {
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) throw { statusCode: 401, message: "Unauthorized: Missing token" };

    const token = authHeader.split(" ")[1];
    if (!token) throw { statusCode: 401, message: "Unauthorized: Missing token" };

    try {
        const payload = jwtService.verifyToken(token);
        return payload;
    } catch (err) {
        throw { statusCode: 401, message: "Unauthorized: Invalid token" };
    }
}
