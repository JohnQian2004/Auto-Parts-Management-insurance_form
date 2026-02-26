# Twilio SMS Simulator Guide

## Overview
The Twilio Simulator allows you to test the complete SMS messaging functionality without requiring an actual Twilio account. It simulates sending SMS messages and automatically generates contextual customer replies.

## Features

✅ **No Twilio Account Required** - Test immediately without signup  
✅ **Realistic Simulation** - Mimics actual SMS behavior  
✅ **Auto-Replies** - Generates contextual customer responses  
✅ **Delayed Responses** - Simulates 2-5 second reply delay  
✅ **Success/Failure Simulation** - 90% success, 10% failure rate  
✅ **Full Database Persistence** - All messages saved to database  
✅ **Easy Toggle** - Switch between simulator and real Twilio  

## How It Works

### Sending SMS (Simulated)
1. User clicks "Send SMS" button
2. System checks if simulator is enabled
3. Simulator generates fake Twilio SID
4. Message saved to database with "sent" status
5. Background thread waits 2-5 seconds
6. Auto-reply generated based on message content
7. Reply saved to database as "inbound" message

### Auto-Reply Intelligence
The simulator analyzes your message and generates contextual replies:

**Vehicle Ready Messages**:
- "Your vehicle is ready for pickup"
- Reply: "Great! What time can I pick it up?"

**Estimate/Price Messages**:
- "Estimate is $500 for repairs"
- Reply: "Thanks for the update. Please proceed with the repairs."

**Waiting for Parts**:
- "Waiting for parts to arrive"
- Reply: "OK, please let me know when the parts arrive."

**Work in Progress**:
- "Currently working on your vehicle"
- Reply: "Thanks for the update!"

**Generic Messages**:
- Any other message
- Reply: "Thank you for the update!"

## Configuration

### Enable Simulator (Default)
In `application.properties`:
```properties
twilio.simulator.enabled=true
```

### Disable Simulator (Use Real Twilio)
```properties
twilio.simulator.enabled=false
twilio.account.sid=YOUR_REAL_SID
twilio.auth.token=YOUR_REAL_TOKEN
twilio.phone.number=+1234567890
```

## Testing Steps

### 1. Create Database Table
```bash
cd Auto-Parts-Management-insurance_form/Server
mysql -u root -ptest testdbjwt < create_smsmessages_table.sql
```

### 2. Verify Simulator is Enabled
Check `application.properties`:
```properties
twilio.simulator.enabled=true
```

### 3. Start Server
```bash
cd Server/parthub-spring-boot-server
mvn spring-boot:run
```

### 4. Test Sending SMS
1. Open any vehicle in the application
2. Click "Send SMS" button
3. Notice "SIMULATOR MODE" badge in modal header
4. See info alert: "Simulator Mode Active"
5. Send message
6. Alert shows: "SMS sent successfully! (SIMULATOR MODE)"
7. Wait 2-5 seconds
8. Click "SMS History" to see auto-reply

### 5. Test SMS History
1. Click "SMS History" button
2. See your sent message (green badge)
3. See auto-reply (blue badge)
4. Click "Reply" to respond
5. Send another message
6. See new auto-reply appear

## UI Indicators

### Simulator Mode Badge
- **Location**: Modal header
- **Color**: Yellow/Warning
- **Icon**: Flask icon
- **Text**: "SIMULATOR MODE"

### Info Alert
- **Location**: Top of send form
- **Message**: "Simulator Mode Active - SMS will be simulated without actual Twilio. An auto-reply will be generated in 2-5 seconds."

### Send Button
- **Text**: "Send SMS (Simulated)" when in simulator mode
- **Text**: "Send SMS" when using real Twilio

### Success Alert
- **Simulator**: "SMS sent successfully! (SIMULATOR MODE) - An auto-reply will arrive in 2-5 seconds."
- **Real Twilio**: "SMS sent successfully!"

## Simulator Behavior

### Message Status
- **Outbound**: 90% "sent", 10% "failed"
- **Inbound**: Always "received"

### Twilio SID Format
- Generated: `SM` + 32 random hex characters
- Example: `SM1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6`

### Phone Number Format
- Simulated Twilio number: `+15555551234`
- Customer number: Uses actual customer phone from vehicle

### Timing
- Send delay: 0.5-1.5 seconds (simulates network)
- Reply delay: 2-5 seconds (simulates customer thinking)

### Auto-Refresh
- Frontend auto-refreshes history after 6 seconds
- Ensures auto-reply is visible without manual refresh

## Database Records

### Outbound Message (Sent)
```sql
SELECT * FROM smsmessages WHERE direction = 'outbound';
```

Example:
```
id: 1
vehicle_id: 1234
user_id: 5
phone_number: +15551234567
message: Your vehicle is ready for pickup
direction: outbound
status: sent
twilio_sid: SM1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6
vehicle_status: Ready for Pickup
created_at: 2026-02-26 10:30:00
```

### Inbound Message (Reply)
```sql
SELECT * FROM smsmessages WHERE direction = 'inbound';
```

Example:
```
id: 2
vehicle_id: 1234
user_id: 0
phone_number: +15551234567
message: Great! What time can I pick it up?
direction: inbound
status: received
twilio_sid: SM2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
created_at: 2026-02-26 10:30:03
```

## API Endpoint

### Check Simulator Status
```
GET /api/sms/simulator/status
Authorization: Required

Response:
{
  "mode": "SIMULATOR",
  "simulatorEnabled": true
}
```

When real Twilio is configured:
```json
{
  "mode": "REAL_TWILIO",
  "simulatorEnabled": false
}
```

## Switching to Real Twilio

### Step 1: Get Twilio Credentials
1. Sign up at https://www.twilio.com/
2. Get Account SID
3. Get Auth Token
4. Get Twilio phone number

### Step 2: Update Configuration
Edit `application.properties`:
```properties
twilio.simulator.enabled=false
twilio.account.sid=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
twilio.auth.token=your_auth_token_here
twilio.phone.number=+15551234567
```

### Step 3: Restart Server
```bash
mvn spring-boot:run
```

### Step 4: Configure Webhook
For receiving real customer replies:
1. Go to Twilio Console
2. Configure webhook: `https://yourdomain.com:8445/api/sms/webhook`

## Advantages of Simulator

### Development
- ✅ Test UI without external dependencies
- ✅ No cost for testing
- ✅ Instant setup
- ✅ Predictable behavior
- ✅ No rate limits

### Testing
- ✅ Test conversation flows
- ✅ Test error handling (10% failure rate)
- ✅ Test auto-reply logic
- ✅ Test database persistence
- ✅ Test UI updates

### Demonstration
- ✅ Demo to stakeholders without Twilio
- ✅ Show complete workflow
- ✅ No real SMS costs
- ✅ Controlled environment

## Limitations

### What Simulator Cannot Do
- ❌ Send actual SMS to real phones
- ❌ Receive real customer replies
- ❌ Test Twilio-specific features
- ❌ Test delivery reports
- ❌ Test carrier-specific issues

### When to Use Real Twilio
- Production deployment
- Testing with real customers
- Testing actual phone delivery
- Testing international numbers
- Testing MMS/media messages

## Troubleshooting

### Simulator Not Working
**Check**:
1. `twilio.simulator.enabled=true` in properties
2. Server restarted after config change
3. Database table `smsmessages` exists
4. No errors in Spring Boot logs

### Auto-Reply Not Appearing
**Check**:
1. Wait 6 seconds for auto-refresh
2. Manually refresh SMS History
3. Check database for inbound messages
4. Check Spring Boot logs for errors

### Wrong Mode Showing
**Check**:
1. Configuration in `application.properties`
2. Server restarted after changes
3. Call `/api/sms/simulator/status` endpoint
4. Check browser console for mode

## Logs

### Simulator Mode Logs
```
INFO: Using Twilio SIMULATOR mode
INFO: SIMULATOR: Sending SMS to +15551234567 with message: Your vehicle is ready
INFO: SIMULATOR: SMS sent - SID: SM1a2b3c4d...
INFO: SIMULATOR: SMS saved to database with ID: 1
INFO: SIMULATOR: Generating auto-reply from +15551234567
INFO: SIMULATOR: Auto-reply generated: Great! What time can I pick it up?
INFO: SIMULATOR: Auto-reply saved to database
```

### Real Twilio Logs
```
INFO: Sending SMS from +15551234567 to +15559876543: Your vehicle is ready
INFO: SMS sent successfully. SID: SM1a2b3c4d...
INFO: SMS saved to database with ID: 1
```

## Code Structure

### Backend Files
- `TwilioSimulatorService.java` - Simulator logic
- `TwilioSmsService.java` - Mode detection and routing
- `SmsMessageController.java` - API endpoints with simulator support

### Frontend Files
- `sms.service.ts` - Added `getSimulatorStatus()`
- `inshop2.component.ts` - Added `checkSimulatorMode()`, `smsSimulatorMode` property
- `inshop2.component.html` - Simulator badges and alerts

## Best Practices

### Development
1. Use simulator for initial development
2. Test all UI flows with simulator
3. Verify database persistence
4. Test error scenarios

### Testing
1. Test with simulator first
2. Switch to real Twilio for integration testing
3. Test with small group before production
4. Monitor costs in Twilio Console

### Production
1. Disable simulator: `twilio.simulator.enabled=false`
2. Use real Twilio credentials
3. Configure webhook for two-way messaging
4. Monitor delivery rates
5. Set up alerts for failures

## Summary

The Twilio Simulator provides a complete testing environment for SMS functionality without requiring external services. It's perfect for:

- ✅ Initial development and testing
- ✅ UI/UX validation
- ✅ Demonstrations
- ✅ Training
- ✅ Cost-free testing

Switch to real Twilio when ready for production deployment!
