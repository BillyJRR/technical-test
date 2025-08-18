import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../../config/dynamoDB";

export class DynamoSpecialtiesRepository {
    private client = dynamoClient();
    private tableName = process.env.SPECIALTIES_TABLE!;

    async findById(specialtyId: string): Promise<{ specialtyId: string; name: string } | null> {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { specialtyId }
        });

        const result = await this.client.send(command);
        if (!result.Item) return null;
        return { specialtyId: result.Item.specialtyId, name: result.Item.name };
    }
}
