import { validateToken } from "../../utils/auth";
import { ListSchedules } from "../../application/schedule/ListSchedules";
import { buildResponse } from "../../utils/response";

export class ScheduleController {
    constructor(private listSchedules: ListSchedules) { }

    async list(event: any) {
        try {
            validateToken(event);
            const schedules = await this.listSchedules.execute();

            return buildResponse(200, { schedules });
        } catch (error) {
            return buildResponse(500, { message: "Internal Server Error", error });
        }
    }
}
