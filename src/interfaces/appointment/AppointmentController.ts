import { validateToken } from "../../utils/auth";
import { CreateAppointment } from "../../application/appointment/CreateAppointment";
import { UpdateAppointmentStatus } from "../../application/appointment/UpdateAppointmentStatus";
import { ListAppointmentsByInsuredId } from "../../application/appointment/ListAppointmentsByInsuredId";
import { buildResponse } from "../../utils/response";

export class AppointmentController {
    constructor(
        private createAppointment: CreateAppointment,
        private updateAppointmentStatus: UpdateAppointmentStatus,
        private listAppointmentsByInsuredId: ListAppointmentsByInsuredId,
    ) { }

    async create(event: any) {
        try {
            validateToken(event);
            const { insuredId, scheduleId, countryISO } = JSON.parse(event.body || "{}");
            if (!insuredId || !scheduleId || !countryISO) {
                return buildResponse(400, { message: "Missing insuredId, scheduleId or country" });
            }

            const appointment = await this.createAppointment.execute(insuredId, scheduleId, countryISO);
            return buildResponse(200, { message: "Appointment created", appointment });
        } catch (error) {
            return buildResponse(500, { message: "Internal Server Error", error });
        }
    }

    async updateStatus(event: any) {
        try {

            for (const record of event.Records) {

                if (!record.body) {
                    return buildResponse(400, { message: "Invalid SQS event: no record body" });
                }

                const eventBridgeEnvelope = JSON.parse(record.body);

                const appointment = eventBridgeEnvelope.detail;

                const appointmentId = appointment.appointmentId;
                if (!appointmentId) {
                    return buildResponse(400, { message: "Missing appointmentId in SQS message" });
                }

                const status = "COMPLETED";

                await this.updateAppointmentStatus.execute(appointmentId, status);
            }
            return buildResponse(200, { message: "All appointments updated" });
        } catch (error) {
            return buildResponse(500, { message: "Internal Server Error", error });
        }
    }

    async listByInsuredId(event: any) {
        try {
            validateToken(event);

            const insuredId = event.pathParameters?.insuredId;
            if (!insuredId) {
                return buildResponse(400, { message: "Missing insuredId parameter" });
            }
            const appointments = await this.listAppointmentsByInsuredId.execute(insuredId);
            return buildResponse(200, { appointments });
        } catch (error) {
            return buildResponse(500, { message: "Internal Server Error", error });
        }
    }

}
