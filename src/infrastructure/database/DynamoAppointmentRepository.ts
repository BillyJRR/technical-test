import { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";
import { PutCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../../config/dynamoDB";

export class DynamoAppointmentRepository implements IAppointmentRepository {
    private client = dynamoClient();
    private tableName = process.env.APPOINTMENTS_TABLE!;
    private insuredIdIndex = "InsuredIdIndex";

    async create(appointment: Appointment): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: appointment,
        };

        await this.client.send(new PutCommand(params));
    }

    async updateStatus(appointmentId: string, status: string): Promise<void> {
        const command = new UpdateCommand({
            TableName: this.tableName,
            Key: { appointmentId },
            UpdateExpression: "set #status = :status",
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: { ":status": status }
        });

        await this.client.send(command);
    }

    async findByInsuredId(insuredId: string): Promise<Appointment[]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            IndexName: this.insuredIdIndex,
            KeyConditionExpression: "insuredId = :insuredId",
            ExpressionAttributeValues: {
                ":insuredId": insuredId,
            },
        });
        const result = await this.client.send(command);

        return (result.Items ?? []).map(item => new Appointment(
            item.appointmentId,
            item.insuredId,
            item.scheduleId,
            item.countryISO,
            item.status,
            item.createdAt
        ));
    }
}
