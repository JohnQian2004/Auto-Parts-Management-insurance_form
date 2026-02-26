# SMS Messaging - Quick Start

## What Was Built
✅ Complete two-way SMS messaging system with Twilio  
✅ **Built-in Simulator** - Test without Twilio account!  
✅ Send SMS from vehicle status screen  
✅ Receive and reply to customer messages  
✅ Full SMS history per vehicle  
✅ Automatic vehicle lookup from phone number  
✅ Message persistence in database  

## Instant Testing (No Twilio Required!)

### 1. Create Database Table
```bash
cd Auto-Parts-Management-insurance_form/Server
mysql -u root -ptest testdbjwt < create_smsmessages_table.sql
```

### 2. Verify Simulator is Enabled (Default)
Check `Server/parthub-spring-boot-server/src/main/resources/application.properties`:
```properties
twilio.simulator.enabled=true
```

### 3. Restart Server
```bash
cd Auto-Parts-Management-insurance_form/Server/parthub-spring-boot-server
mvn spring-boot:run
```

### 4. Test Immediately!
1. Open any vehicle
2. Click "Send SMS" button
3. See "SIMULATOR MODE" badge
4. Send message
5. Wait 2-5 seconds
6. Check SMS History for auto-reply

**That's it! No Twilio signup needed for testing.**

## Simulator Features

✅ **Auto-Replies** - Generates contextual customer responses  
✅ **Realistic Timing** - 2-5 second reply delay  
✅ **Smart Responses** - Context-aware replies based on your message  
✅ **Full Persistence** - All messages saved to database  
✅ **UI Indicators** - Clear simulator mode badges  

### Example Auto-Replies

**Your message**: "Your vehicle is ready for pickup"  
**Auto-reply**: "Great! What time can I pick it up?"

**Your message**: "Estimate is $500 for repairs"  
**Auto-reply**: "Thanks for the update. Please proceed with the repairs."

**Your message**: "Waiting for parts to arrive"  
**Auto-reply**: "OK, please let me know when the parts arrive."

## Production Setup (Optional - When Ready)

### 1. Sign Up for Twilio
1. Go to https://www.twilio.com/try-twilio
2. Sign up (get $15 free credit)
3. Get a phone number (free)
4. Copy Account SID, Auth Token, Phone Number

### 2. Configure Twilio
Edit `Server/parthub-spring-boot-server/src/main/resources/application.properties`:

```properties
twilio.simulator.enabled=false
twilio.account.sid=YOUR_ACCOUNT_SID
twilio.auth.token=YOUR_AUTH_TOKEN
twilio.phone.number=+1234567890
```

### 3. Add Twilio Dependency
Add to `Server/parthub-spring-boot-server/pom.xml`:

```xml
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>9.14.1</version>
</dependency>
```

### 4. Restart Server
```bash
mvn clean install
mvn spring-boot:run
```

### 5. Configure Webhook (For Two-Way)
In Twilio Console:
- Webhook: `https://yourdomain.com:8445/api/sms/webhook`
- Method: POST

## How to Use

### Send SMS to Customer
1. Open vehicle details
2. Click "Send SMS" button (next to vehicle status)
3. Message is pre-filled with vehicle info
4. Edit if needed
5. Click "Send SMS"

### View SMS History
1. Click "SMS History" button
2. See all sent/received messages
3. Click "Reply" to respond to customer

### Receive Customer Replies
**Simulator Mode**: Auto-replies appear in 2-5 seconds  
**Real Twilio**: Actual customer replies via webhook

## UI Features

### Send SMS Button
- Located in vehicle status row
- Opens form with pre-filled message
- Shows vehicle info and current status

### Simulator Indicators
- **Badge**: "SIMULATOR MODE" in modal header
- **Alert**: Info message about simulator
- **Button**: "Send SMS (Simulated)"
- **Success**: Special message with timing info

### SMS History Button
- Shows message count badge
- Opens conversation view
- Color-coded: Green (sent), Blue (received)
- Status badges: Delivered, Failed, etc.

### Send SMS Form
- Customer phone (editable)
- Message text (1600 char limit)
- Character counter
- Pre-filled with vehicle details
- Simulator mode indicators

### SMS History Modal
- Chronological conversation view
- Direction indicators (sent/received)
- Status badges
- Reply button for incoming messages
- Send new SMS button

## Database

Table: `smsmessages`
- Stores all sent/received messages
- Links to vehicle_id
- Tracks phone_number
- Records status and errors
- Timestamps for history

## API Endpoints

- `POST /api/sms/send` - Send SMS (simulator or real)
- `GET /api/sms/vehicle/{id}` - Get vehicle SMS history
- `GET /api/sms/simulator/status` - Check simulator mode
- `POST /api/sms/webhook` - Receive incoming SMS (Twilio only)

## Cost

### Simulator Mode (Default)
- **Cost**: FREE
- **Setup Time**: 2 minutes
- **Testing**: Unlimited

### Real Twilio (Production)
- Free trial: $15 credit
- SMS: ~$0.0075 per message
- Phone: ~$1/month
- Incoming: Free

## Troubleshooting

**SMS not sending?**
- Check simulator is enabled
- Verify database table exists
- Check Spring Boot logs

**Auto-reply not appearing?**
- Wait 6 seconds (auto-refresh)
- Manually refresh SMS History
- Check database for inbound messages

**Want to use real Twilio?**
- Set `twilio.simulator.enabled=false`
- Add real credentials
- Restart server

## Files to Review

### Backend
- `Server/create_smsmessages_table.sql`
- `Server/parthub-spring-boot-server/src/main/java/com/xoftex/parthub/service/TwilioSimulatorService.java`
- `Server/parthub-spring-boot-server/src/main/java/com/xoftex/parthub/service/TwilioSmsService.java`
- `Server/parthub-spring-boot-server/src/main/java/com/xoftex/parthub/controllers/SmsMessageController.java`

### Frontend
- `Client/angular-parthub/src/app/_services/sms.service.ts`
- `Client/angular-parthub/src/app/inshop2/inshop2.component.ts` (SMS methods)
- `Client/angular-parthub/src/app/inshop2/inshop2.component.html` (SMS UI)

## Documentation

- `SMS_SIMULATOR_GUIDE.md` - Complete simulator documentation
- `SMS_MESSAGING_SETUP_GUIDE.md` - Full system documentation
- `SMS_QUICK_START.md` - This file

## Next Steps

1. ✅ Create database table
2. ✅ Test with simulator (no Twilio needed)
3. ✅ Verify UI and functionality
4. ⏳ When ready: Configure real Twilio
5. ⏳ Deploy to production

**Start testing immediately with the built-in simulator!**
