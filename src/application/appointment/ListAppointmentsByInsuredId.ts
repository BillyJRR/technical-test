import { IAppointmentRepository } from "../../domain/repositories/IAppointmentRepository";

export class ListAppointmentsByInsuredId {
    constructor(private appointmentRepo: IAppointmentRepository) { }

    async execute(insuredId: string) {
        return await this.appointmentRepo.findByInsuredId(insuredId);
    }
}
