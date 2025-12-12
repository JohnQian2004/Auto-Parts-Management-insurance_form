import { Appointment } from "./appointment";

export class GroupedAppointments  {
    [key: string]: Appointment[];
}