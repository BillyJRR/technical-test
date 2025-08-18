import jwt from "jsonwebtoken";

export class JwtService {
    private secret: string;

    constructor() {
        this.secret = process.env.JWT_SECRET!;
    }

    generateToken(payload: object): string {
        return jwt.sign(payload, this.secret);
    }

    verifyToken(token: string): any {
        try {
            const payload = jwt.verify(token, this.secret);
            return payload;
        } catch (err) {
            throw new Error("Invalid token");
        }
    }
}
