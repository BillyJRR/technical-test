import bcrypt from "bcryptjs";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { JwtService } from "../../infrastructure/security/JwtService";
import { DynamoInsuredsRepository } from "../../infrastructure/database/DynamoInsuredsRepository";

export class LoginUser {
    constructor(
        private userRepository: IUserRepository,
        private jwtService: JwtService,
        private insuredsRepo = new DynamoInsuredsRepository
    ) { }

    async execute(email: string, password: string): Promise<LoginResult | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) return null;

        const isValid = await bcrypt.compare(password.toString(), user.passwordHash);
        if (!isValid) return null;

        const token = this.jwtService.generateToken({ userId: user.userId, email: user.email });

        const insured = await this.insuredsRepo.findById(user.insuredId?.toString());

        return {
            token,
            user: { userId: user.userId, email: user.email },
            insured: insured || undefined
        };
    }
}