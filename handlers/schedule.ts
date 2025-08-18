import { ListSchedules } from "../src/application/schedule/ListSchedules";
import { ScheduleController } from "../src/interfaces/schedule/ScheduleController";

const listSchedules = new ListSchedules();
const scheduleController = new ScheduleController(listSchedules);

export const handler = async (event: any) => {
    return await scheduleController.list(event);
};