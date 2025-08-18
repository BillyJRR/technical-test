import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../../config/dynamoDB";

export class DynamoCentersRepository {
    private client = dynamoClient();
    private tableName = process.env.CENTERS_TABLE!;

    async findById(centerId: string): Promise<{ centerId: string; name: string; country: string } | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { centerId }
        });

        const result = await this.client.send(command);
        if (!result.Item) return null;
        return { centerId: result.Item.centerId, name: result.Item.name, country: result.Item.country };
    }
}
