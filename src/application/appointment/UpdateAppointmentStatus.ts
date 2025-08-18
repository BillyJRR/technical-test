import { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";

export class UpdateAppointmentStatus {
    constructor(private appointmentRepo: IAppointmentRepository) { }

    async execute(appointmentId: string, status: string): Promise<void> {
        await this.appointmentRepo.updateStatus(appointmentId, status);
    }
}
