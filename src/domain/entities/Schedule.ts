export class Schedule {
    constructor(
        public scheduleId: number,
        public centerId: number,
        public specialtyId: number,
        public medicId: number,
        public date: string
    ) { }
}