import { PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { eventBridgeClient } from "../../config/eventBridge";

export class EventBridgeService {
    private client = eventBridgeClient();

    async publishAppointmentCompleted(appointment: any) {
        const command = new PutEventsCommand({
            Entries: [
                {
                    Source: "appointments",
                    DetailType: "AppointmentCompleted",
                    Detail: JSON.stringify(appointment),
                    EventBusName: process.env.EVENT_BUS_NAME
                }
            ]
        });

        await this.client.send(command);

    }
}
