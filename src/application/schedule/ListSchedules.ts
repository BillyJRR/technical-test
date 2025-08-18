import { DynamoSchedulesRepository } from "../../infrastructure/database/DynamoScheduleRepository";
import { DynamoCentersRepository } from "../../infrastructure/database/DynamoCentersRepository";
import { DynamoSpecialtiesRepository } from "../../infrastructure/database/DynamoSpecialtiesRepository";
import { DynamoMedicsRepository } from "../../infrastructure/database/DynamoMedicsRepository";

export class ListSchedules {
    private schedulesRepo = new DynamoSchedulesRepository();
    private centersRepo = new DynamoCentersRepository();
    private specialtiesRepo = new DynamoSpecialtiesRepository();
    private medicsRepo = new DynamoMedicsRepository();

    async execute() {
        const schedules = await this.schedulesRepo.findAll();

        const enriched = await Promise.all(schedules.map(async s => {
            const center = await this.centersRepo.findById(s.centerId.toString());
            const specialty = await this.specialtiesRepo.findById(s.specialtyId.toString());
            const medic = await this.medicsRepo.findById(s.medicId.toString());

            return {
                ...s,
                centerName: center?.name ?? null,
                specialtyName: specialty?.name ?? null,
                medicName: medic?.name ?? null,
                country: center?.country ?? null,
            };
        }));

        return enriched;
    }
}
