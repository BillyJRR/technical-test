export class Appointment {
    constructor(
        public appointmentId: string,
        public insuredId: string,
        public scheduleId: string,
        public countryISO: string,
        public status: string,
        public createdAt: string
    ) { }
}
