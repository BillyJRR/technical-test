import { ListAppointmentsByInsuredId } from "../../src/application/appointment/ListAppointmentsByInsuredId";
import { Appointment } from "../../src/domain/entities/Appointment";

describe("ListAppointmentsByInsuredId", () => {
    it("should return a list of appointments for a given insuredId", async () => {
        const insuredId = "00123";

        const mockAppointments: Appointment[] = [
            new Appointment("1", insuredId, "101", "PE", "PENDING", new Date().toISOString()),
            new Appointment("2", insuredId, "102", "PE", "COMPLETED", new Date().toISOString()),
        ];

        const mockRepo = {
            findByInsuredId: jest.fn().mockResolvedValue(mockAppointments),
        };

        const listAppointments = new ListAppointmentsByInsuredId(mockRepo as any);

        const result = await listAppointments.execute(insuredId);

        expect(result).toHaveLength(2);
        expect(result[0].insuredId).toBe(insuredId);
        expect(result[1].status).toBe("COMPLETED");

        expect(mockRepo.findByInsuredId).toHaveBeenCalledWith(insuredId);
    });

    it("should return an empty array if no appointments found", async () => {
        const insuredId = "00000";

        const mockRepo = {
            findByInsuredId: jest.fn().mockResolvedValue([]),
        };

        const listAppointments = new ListAppointmentsByInsuredId(mockRepo as any);

        const result = await listAppointments.execute(insuredId);

        expect(result).toEqual([]);
        expect(mockRepo.findByInsuredId).toHaveBeenCalledWith(insuredId);
    });
});
