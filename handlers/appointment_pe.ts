import { AppointmentMySQLRepository } from "../src/infrastructure/database/AppointmentMySQLRepository";
import { EventBridgeService } from "../src/infrastructure/messaging/EventBridgeService";

const repo = new AppointmentMySQLRepository("PE");
const eventBridge = new EventBridgeService();

export const handler = async (event: any) => {
    for (const record of event.Records) {
        const snsEnvelope = JSON.parse(record.body);
        const appointment = JSON.parse(snsEnvelope.Message);

        //await repo.createFromSqs(appointment);

        await eventBridge.publishAppointmentCompleted({
            appointmentId: appointment.appointmentId
        });
    }
};
