import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../../config/dynamoDB";

export class DynamoMedicsRepository {
    private client = dynamoClient();
    private tableName = process.env.MEDICS_TABLE!;

    async findById(medicId: string): Promise<{ medicId: string; name: string } | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { medicId }
        });

        const result = await this.client.send(command);
        if (!result.Item) return null;
        return { medicId: result.Item.medicId, name: result.Item.name };
    }
}
