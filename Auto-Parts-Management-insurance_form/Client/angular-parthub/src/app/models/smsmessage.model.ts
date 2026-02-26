export class SmsMessage {
    id!: number;
    vehicleId!: number;
    userId!: number;
    phoneNumber!: string;
    message!: string;
    direction!: string; // 'outbound' or 'inbound'
    status!: string; // 'sent', 'delivered', 'failed', 'received'
    twilioSid!: string;
    vehicleStatus!: string;
    errorMessage!: string;
    createdAt!: Date;
    updatedAt!: Date;
}
