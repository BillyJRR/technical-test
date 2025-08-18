import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "../../config/sqs";

export class SqsService {
    private client = sqsClient();

    async sendMessage(queueUrl: string, message: any) {
        const command = new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(message)
        });

        await this.client.send(command);
    }
}
