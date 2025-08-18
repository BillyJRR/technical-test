import { CreateAppointment } from "../../src/application/appointment/CreateAppointment";
import { Appointment } from "../../src/domain/entities/Appointment";

describe("CreateAppointment", () => {
    it("should create an appointment and publish to SNS", async () => {
        const mockRepo = { create: jest.fn().mockResolvedValue(undefined) };
        const mockSns = { publishAppointment: jest.fn().mockResolvedValue(undefined) };

        const createAppointment = new CreateAppointment(mockRepo as any, mockSns as any);

        const insuredId = "00123";
        const scheduleId = "102";
        const countryISO = "PE";

        const appointment = await createAppointment.execute(insuredId, scheduleId, countryISO);

        expect(appointment).toHaveProperty("appointmentId");
        expect(appointment.insuredId).toBe(insuredId);
        expect(appointment.scheduleId).toBe(scheduleId);
        expect(appointment.countryISO).toBe(countryISO);
        expect(appointment.status).toBe("PENDING");

        expect(mockRepo.create).toHaveBeenCalledWith(expect.any(Appointment));
        expect(mockSns.publishAppointment).toHaveBeenCalledWith(expect.any(Appointment));
    });
});
