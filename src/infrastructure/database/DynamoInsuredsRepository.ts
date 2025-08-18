import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../../config/dynamoDB";

export class DynamoInsuredsRepository {
    private client = dynamoClient();
    private tableName = process.env.INSUREDS_TABLE!;

    async findById(insuredId: string): Promise<{ insuredId: string; fullName: string } | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { insuredId }
        });

        const result = await this.client.send(command);
        if (!result.Item) return null;
        return { insuredId: result.Item.insuredId, fullName: result.Item.fullName };
    }
}
