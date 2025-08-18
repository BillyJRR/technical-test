import { LoginUser } from "../../src/application/login/LoginUser";
import bcrypt from "bcryptjs";

describe("LoginUser", () => {
    it("should return token when email and password are correct", async () => {
        const mockRepo = {
            findByEmail: jest.fn().mockResolvedValue({
                userId: "1",
                email: "juan.perez@test.com",
                insuredId: "00123",
                passwordHash: "hashedpassword"
            })
        };

        const mockInsuredsRepo = {
            findById: jest.fn().mockResolvedValue({
                insuredId: "00123",
                fullName: "Juan Pérez García"
            })
        };

        const mockJwtService = {
            generateToken: jest.fn().mockReturnValue("FAKE_TOKEN")
        };

        bcrypt.compare = jest.fn().mockResolvedValue(true);

        const login = new LoginUser(mockRepo as any, mockJwtService as any, mockInsuredsRepo as any);
        const result = await login.execute("juan.perez@test.com", "password");

        expect(result).toEqual({
            token: "FAKE_TOKEN",
            user: { userId: "1", email: "juan.perez@test.com" },
            insured: { insuredId: "00123", fullName: "Juan Pérez García" }
        });
        expect(mockRepo.findByEmail).toHaveBeenCalledWith("juan.perez@test.com");
        expect(mockJwtService.generateToken).toHaveBeenCalled();
        expect(mockInsuredsRepo.findById).toHaveBeenCalledWith("00123");
    });

    it("should return null if user not found", async () => {
        const mockRepo = { findByEmail: jest.fn().mockResolvedValue(null) };

        const mockJwtService = { generateToken: jest.fn() };
        const login = new LoginUser(mockRepo as any, mockJwtService as any);

        const token = await login.execute("unknown@email.com", "password");
        expect(token).toBeNull();
    });

    it("should return null if password is incorrect", async () => {
        const mockRepo = {
            findByEmail: jest.fn().mockResolvedValue({
                userId: "1",
                email: "juan.perez@test.com",
                insuredId: "00123",
                passwordHash: "hashedpassword"
            })
        };


        const mockJwtService = { generateToken: jest.fn() };
        const mockInsuredsRepo = { findById: jest.fn() };

        bcrypt.compare = jest.fn().mockResolvedValue(false);

        const login = new LoginUser(mockRepo as any, mockJwtService as any, mockInsuredsRepo as any);

        const token = await login.execute("juan.perez@test.com", "wrongpassword");
        expect(token).toBeNull();
    });
});
