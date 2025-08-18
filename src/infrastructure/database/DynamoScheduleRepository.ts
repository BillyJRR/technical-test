import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../../config/dynamoDB";
import { Schedule } from "../../domain/entities/Schedule";

export class DynamoSchedulesRepository {
    private client = dynamoClient();
    private tableName = process.env.SCHEDULES_TABLE!;

    async findAll(): Promise<Schedule[]> {
        const command = new ScanCommand({ TableName: this.tableName });
        const result = await this.client.send(command);
        return (result.Items ?? []).map(item => new Schedule(
            item.scheduleId,
            item.centerId,
            item.specialtyId,
            item.medicId,
            item.date
        ));
    }
}
