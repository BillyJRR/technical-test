import { Appointment } from "../entities/Appointment";

export interface IAppointmentRepository {
    create(appointment: Appointment): Promise<void>;
    updateStatus(appointmentId: string, status: string): Promise<void>;
    findByInsuredId(insuredId: string): Promise<Appointment[]>;
}