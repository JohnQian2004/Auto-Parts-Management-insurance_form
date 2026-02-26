# SMS Messaging System Setup Guide

## Overview
A comprehensive two-way SMS messaging system integrated with Twilio that allows sending vehicle status updates to customers and receiving replies, with full message history tracking.

## Features
- ✅ Send SMS to customers from vehicle status screen
- ✅ Pre-filled messages with vehicle information and status
- ✅ Two-way messaging (send and receive)
- ✅ SMS history per vehicle
- ✅ Reply to customer messages
- ✅ Automatic vehicle lookup from phone number
- ✅ Message persistence in database
- ✅ Twilio integration for reliable delivery

## Architecture

### Backend Components

#### 1. Database Table: `smsmessages`
Stores all SMS messages (sent and received):
- `id` - Primary key
- `vehicle_id` - Links to vehicle
- `user_id` - User who sent the message
- `phone_number` - Customer phone number
- `message` - Message content (up to 1600 chars)
- `direction` - "outbound" or "inbound"
- `status` - "sent", "delivered", "failed", "received"
- `twilio_sid` - Twilio message ID
- `vehicle_status` - Vehicle status at time of sending
- `error_message` - Error details if failed
- `created_at`, `updated_at` - Timestamps

#### 2. Model: `SmsMessage.java`
JPA entity mapped to `smsmessages` table

#### 3. Repository: `SmsMessageRepository.java`
Data access methods:
- `findByVehicleIdOrderByCreatedAtDesc()` - Get all messages for a vehicle
- `findByPhoneNumberOrderByCreatedAtDesc()` - Get all messages for a phone number
- `findVehicleIdsByPhoneNumber()` - Find vehicles by customer phone

#### 4. Service: `TwilioSmsService.java`
Handles Twilio API integration:
- `sendSms()` - Send SMS via Twilio
- `formatPhoneNumber()` - Format phone numbers for US (+1)
- `isConfigured()` - Check if Twilio is configured

#### 5. Controller: `SmsMessageController.java`
REST API endpoints:
- `POST /api/sms/send` - Send SMS to customer
- `POST /api/sms/webhook` - Receive incoming SMS from Twilio
- `GET /api/sms/vehicle/{vehicleId}` - Get SMS history for vehicle
- `GET /api/sms/phone/{phoneNumber}` - Get SMS history for phone

### Frontend Components

#### 1. Model: `smsmessage.model.ts`
TypeScript interface for SMS messages

#### 2. Service: `sms.service.ts`
Angular service for API calls:
- `sendSms()` - Send SMS
- `getVehicleSmsMessages()` - Get vehicle SMS history
- `getPhoneSmsMessages()` - Get phone SMS history

#### 3. Component: `inshop2.component.ts`
Methods added:
- `openSmsForm()` - Open send SMS form
- `closeSmsForm()` - Close send SMS form
- `sendSmsMessage()` - Send SMS message
- `openSmsHistory()` - Open SMS history modal
- `closeSmsHistory()` - Close SMS history modal
- `loadSmsHistory()` - Load SMS messages for vehicle
- `replyToSms()` - Reply to customer message
- `formatSmsDate()` - Format date for display

#### 4. Template: `inshop2.component.html`
UI components:
- "Send SMS" button in vehicle status row
- "SMS History" button showing message count
- Send SMS modal with pre-filled message
- SMS History modal with conversation view

## Setup Instructions

### Step 1: Create Database Table

Run the SQL script:
```bash
cd Auto-Parts-Management-insurance_form/Server
mysql -u root -ptest testdbjwt < create_smsmessages_table.sql
```

Or manually:
```sql
USE testdbjwt;
CREATE TABLE IF NOT EXISTS smsmessages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    vehicle_id BIGINT DEFAULT 0,
    user_id BIGINT DEFAULT 0,
    phone_number VARCHAR(20),
    message VARCHAR(1600),
    direction VARCHAR(20),
    status VARCHAR(50),
    twilio_sid VARCHAR(100),
    vehicle_status VARCHAR(255),
    error_message VARCHAR(500),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_phone_number (phone_number),
    INDEX idx_direction (direction),
    INDEX idx_created_at (created_at)
);
```

### Step 2: Configure Twilio

#### A. Sign up for Twilio
1. Go to https://www.twilio.com/
2. Sign up for a free account
3. Get a Twilio phone number (free trial includes one)

#### B. Get Credentials
1. Go to Twilio Console Dashboard
2. Copy your "Account SID"
3. Copy your "Auth Token"
4. Copy your Twilio phone number

#### C. Update application.properties
Edit `Server/parthub-spring-boot-server/src/main/resources/application.properties`:

```properties
# Twilio SMS Configuration
twilio.account.sid=YOUR_ACCOUNT_SID_HERE
twilio.auth.token=YOUR_AUTH_TOKEN_HERE
twilio.phone.number=+1234567890
```

Replace with your actual values:
- `YOUR_ACCOUNT_SID_HERE` - Your Twilio Account SID
- `YOUR_AUTH_TOKEN_HERE` - Your Twilio Auth Token
- `+1234567890` - Your Twilio phone number (must include +1)

### Step 3: Configure Twilio Webhook (for receiving messages)

1. Go to Twilio Console > Phone Numbers > Manage > Active Numbers
2. Click on your phone number
3. Scroll to "Messaging Configuration"
4. Under "A MESSAGE COMES IN":
   - Select "Webhook"
   - Enter: `https://yourdomain.com:8445/api/sms/webhook`
   - Method: HTTP POST
5. Click "Save"

**Note**: Replace `yourdomain.com` with your actual domain. For local testing, use ngrok:
```bash
ngrok http 8445
# Use the ngrok URL: https://xxxxx.ngrok.io/api/sms/webhook
```

### Step 4: Add Twilio Dependency

Add to `Server/parthub-spring-boot-server/pom.xml`:

```xml
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>9.14.1</version>
</dependency>
```

### Step 5: Restart Spring Boot Server

```bash
cd Auto-Parts-Management-insurance_form/Server/parthub-spring-boot-server
mvn clean install
mvn spring-boot:run
```

### Step 6: Rebuild Angular Frontend

```bash
cd Auto-Parts-Management-insurance_form/Client/angular-parthub
npm install
ng serve
```

## Usage Guide

### Sending SMS to Customer

1. Open a vehicle in the edit modal
2. In the "Vehicle Status" row, click "Send SMS" button
3. The form opens with:
   - Customer phone number (pre-filled)
   - Message with vehicle info and status (pre-filled)
4. Edit message if needed
5. Click "Send SMS"
6. Message is sent via Twilio and saved to database

### Viewing SMS History

1. Open a vehicle in the edit modal
2. Click "SMS History" button (shows message count)
3. View all sent and received messages:
   - Green badge = Sent messages
   - Blue badge = Received messages
   - Status badges show delivery status
4. Click "Reply" on received messages to respond

### Receiving Customer Replies

1. Customer replies to your SMS
2. Twilio sends webhook to your server
3. System automatically:
   - Finds vehicle by phone number
   - Saves message to database
   - Links to correct vehicle
4. View reply in SMS History

## Message Flow

### Outbound (Sending to Customer)

```
User clicks "Send SMS"
    ↓
Frontend: openSmsForm()
    ↓
User enters/edits message
    ↓
Frontend: sendSmsMessage()
    ↓
Backend: POST /api/sms/send
    ↓
TwilioSmsService.sendSms()
    ↓
Twilio API sends SMS
    ↓
Save to smsmessages table
    ↓
Return success to frontend
```

### Inbound (Receiving from Customer)

```
Customer sends SMS reply
    ↓
Twilio receives message
    ↓
Twilio webhook: POST /api/sms/webhook
    ↓
Find vehicle by phone number
    ↓
Save to smsmessages table
    ↓
Return TwiML response
    ↓
User views in SMS History
```

## API Endpoints

### Send SMS
```
POST /api/sms/send
Authorization: Required (USER, MODERATOR, ADMIN, SHOP, RECYCLER)

Request Body:
{
  "vehicleId": 1234,
  "userId": 5,
  "phoneNumber": "+15551234567",
  "message": "Your vehicle is ready!",
  "vehicleStatus": "Ready for Pickup"
}

Response:
{
  "id": 1,
  "vehicleId": 1234,
  "userId": 5,
  "phoneNumber": "+15551234567",
  "message": "Your vehicle is ready!",
  "direction": "outbound",
  "status": "sent",
  "twilioSid": "SM1234567890abcdef",
  "vehicleStatus": "Ready for Pickup",
  "createdAt": "2026-02-26T10:30:00Z"
}
```

### Get Vehicle SMS History
```
GET /api/sms/vehicle/{vehicleId}
Authorization: Required

Response:
[
  {
    "id": 1,
    "vehicleId": 1234,
    "phoneNumber": "+15551234567",
    "message": "Your vehicle is ready!",
    "direction": "outbound",
    "status": "delivered",
    "createdAt": "2026-02-26T10:30:00Z"
  },
  {
    "id": 2,
    "vehicleId": 1234,
    "phoneNumber": "+15551234567",
    "message": "Thank you! I'll pick it up today.",
    "direction": "inbound",
    "status": "received",
    "createdAt": "2026-02-26T10:35:00Z"
  }
]
```

### Twilio Webhook (Receive SMS)
```
POST /api/sms/webhook
Authorization: Public (Twilio webhook)

Form Parameters:
- From: +15551234567
- Body: Customer message text
- MessageSid: SM1234567890abcdef

Response: TwiML (XML)
```

## Troubleshooting

### Issue: SMS not sending
**Solutions**:
1. Check Twilio credentials in application.properties
2. Verify Twilio account has credits
3. Check phone number format (+1 for US)
4. View error in SMS History modal
5. Check Spring Boot logs for errors

### Issue: Not receiving customer replies
**Solutions**:
1. Verify webhook URL is configured in Twilio
2. Check webhook URL is publicly accessible
3. Use ngrok for local testing
4. Check Spring Boot logs for webhook calls
5. Verify phone number format in database

### Issue: Can't find vehicle from phone number
**Solutions**:
1. Ensure customer phone is saved in vehicle.customer.phone
2. Phone format must match (use formatPhoneNumber)
3. Check VehicleRepository.findByCustomerPhone() query
4. Manually link by checking smsmessages table

### Issue: Twilio not configured error
**Solutions**:
1. Verify all three properties are set:
   - twilio.account.sid
   - twilio.auth.token
   - twilio.phone.number
2. Restart Spring Boot server after changes
3. Check TwilioSmsService.isConfigured() returns true

## Testing

### Test Sending SMS
1. Open any vehicle
2. Click "Send SMS"
3. Enter your own phone number
4. Send test message
5. Verify you receive SMS
6. Check SMS History shows message

### Test Receiving SMS
1. Reply to the SMS you received
2. Check Spring Boot logs for webhook call
3. Open vehicle SMS History
4. Verify reply appears
5. Click "Reply" to respond

### Test Without Twilio (Development)
If Twilio is not configured:
- Messages still save to database
- Status shows "failed"
- Error message shows "Twilio not configured"
- Can test UI and database without Twilio account

## Database Queries

### View all SMS messages
```sql
SELECT * FROM smsmessages ORDER BY created_at DESC LIMIT 50;
```

### View messages for specific vehicle
```sql
SELECT * FROM smsmessages WHERE vehicle_id = 1234 ORDER BY created_at DESC;
```

### View messages for specific phone
```sql
SELECT * FROM smsmessages WHERE phone_number = '+15551234567' ORDER BY created_at DESC;
```

### Count messages by direction
```sql
SELECT direction, COUNT(*) as count FROM smsmessages GROUP BY direction;
```

### View failed messages
```sql
SELECT * FROM smsmessages WHERE status = 'failed' ORDER BY created_at DESC;
```

## Security Considerations

1. **Webhook Security**: Twilio webhook is public but validates requests
2. **Phone Number Privacy**: Store only necessary phone data
3. **Message Content**: Don't include sensitive information in SMS
4. **Rate Limiting**: Twilio has rate limits, monitor usage
5. **Credentials**: Keep Twilio credentials secure, never commit to git

## Cost Considerations

- Twilio free trial: $15 credit
- SMS cost: ~$0.0075 per message (US)
- Phone number: ~$1/month
- Incoming messages: Free
- Monitor usage in Twilio Console

## Files Created/Modified

### Backend
- ✅ `models/SmsMessage.java` - Entity model
- ✅ `repository/SmsMessageRepository.java` - Data access
- ✅ `service/TwilioSmsService.java` - Twilio integration
- ✅ `controllers/SmsMessageController.java` - REST API
- ✅ `repository/VehicleRepository.java` - Added findByCustomerPhone()
- ✅ `security/WebSecurityConfig.java` - Added SMS endpoints
- ✅ `application.properties` - Added Twilio config
- ✅ `create_smsmessages_table.sql` - Database schema

### Frontend
- ✅ `models/smsmessage.model.ts` - TypeScript model
- ✅ `_services/sms.service.ts` - Angular service
- ✅ `inshop2/inshop2.component.ts` - Added SMS methods
- ✅ `inshop2/inshop2.component.html` - Added SMS UI

## Next Steps

1. ✅ Create database table
2. ✅ Configure Twilio credentials
3. ✅ Set up webhook URL
4. ✅ Add Twilio dependency to pom.xml
5. ✅ Restart backend server
6. ✅ Test sending SMS
7. ✅ Test receiving SMS
8. ✅ Monitor usage and costs

## Support

For issues:
1. Check Spring Boot logs
2. Check browser console
3. Check Twilio logs in Console
4. Verify database records
5. Test with ngrok for local development
