export class SmsMessage {
    id: number;
    vehicleId: number;
    userId: number;
    phoneNumber: string;
    message: string;
    direction: string;
    status: string;
    twilioSid: string;
    errorMessage: string;
    createdAt: Date;
}
