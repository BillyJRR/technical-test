import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { dynamoClient } from "../../config/dynamoDB";

export class DynamoUserRepository implements IUserRepository {
    private client = dynamoClient();
    private tableName = process.env.USERS_TABLE!;
    private emailIndex = "EmailIndex";

    async findByEmail(email: string): Promise<User | null> {
        const params = {
            TableName: this.tableName,
            IndexName: this.emailIndex,
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: { ":email": email },
        };

        const result = await this.client.send(new QueryCommand(params));
        if (!result.Items || result.Items.length === 0) {
            return null;
        }

        return new User(result.Items[0].userId, result.Items[0].email, result.Items[0].insuredId, result.Items[0].passwordHash);
    }
}
