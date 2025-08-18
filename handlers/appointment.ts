import { DynamoAppointmentRepository } from "../src/infrastructure/database/DynamoAppointmentRepository";
import { CreateAppointment } from "../src/application/appointment/CreateAppointment";
import { UpdateAppointmentStatus } from "../src/application/appointment/UpdateAppointmentStatus";
import { ListAppointmentsByInsuredId } from "../src/application/appointment/ListAppointmentsByInsuredId";
import { AppointmentController } from "../src/interfaces/appointment/AppointmentController";
import { SnsService } from "../src/infrastructure/messaging/SnsService";

const appointmentRepo = new DynamoAppointmentRepository();
const snsService = new SnsService();
const createAppointment = new CreateAppointment(appointmentRepo, snsService);
const updateAppointmentStatus = new UpdateAppointmentStatus(appointmentRepo);
const listAppointmentsByInsuredId = new ListAppointmentsByInsuredId(appointmentRepo);

const appointmentController = new AppointmentController(
    createAppointment,
    updateAppointmentStatus,
    listAppointmentsByInsuredId
);

export const handler = async (event: any) => {
    if (event.body) {
        return await appointmentController.create(event);
    }

    if (event.Records) {
        return await appointmentController.updateStatus(event);
    }

    if (event.pathParameters?.insuredId) {
        return await appointmentController.listByInsuredId(event);
    }

    return { statusCode: 400, body: "Invalid event source" };
};
