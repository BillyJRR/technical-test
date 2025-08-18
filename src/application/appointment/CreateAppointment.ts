import { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";
import { randomUUID } from "crypto";
import { SnsService } from "../../infrastructure/messaging/SnsService";

export class CreateAppointment {
    constructor(
        private appointmentRepo: IAppointmentRepository,
        private snsService: SnsService
    ) { }


    async execute(insuredId: string, scheduleId: string, countryISO: string): Promise<Appointment> {
        const appointmentId = randomUUID();
        const appointment = new Appointment(
            appointmentId,
            insuredId.toString(),
            scheduleId.toString(),
            countryISO,
            "PENDING",
            new Date().toISOString()
        );

        await this.appointmentRepo.create(appointment);

        await this.snsService.publishAppointment(appointment);

        return appointment;
    }
}
