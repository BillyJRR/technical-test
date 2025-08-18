import { createPool } from "../../config/mysql";

export class AppointmentMySQLRepository {
    private pool;

    constructor(private country: "PE" | "CL") {
        this.pool = createPool(country);
    }

    async createFromSqs(appointment: any) {
        const sql = `
            INSERT INTO appointments
            (appointmentId, insuredId, scheduleId, countryISO, status, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await this.pool.query(sql, [
            appointment.appointmentId,
            appointment.insuredId,
            appointment.scheduleId,
            appointment.countryISO,
            'COMPLETED',
            appointment.createdAt
        ]);
    }
}
