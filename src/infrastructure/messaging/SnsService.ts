import { PublishCommand } from "@aws-sdk/client-sns";
import { snsClient } from "../../config/sns";

export class SnsService {
    private client = snsClient();

    async publishAppointment(appointment: any) {
        let topicArn = "";
        switch (appointment.countryISO) {
            case "PE":
                topicArn = process.env.SNS_TOPIC_PE!;
                break;
            case "CL":
                topicArn = process.env.SNS_TOPIC_CL!;
                break;
            default:
                throw new Error("Unsupported country");
        }

        const command = new PublishCommand({
            TopicArn: topicArn,
            Message: JSON.stringify(appointment)
        });

        await this.client.send(command);
    }
}
