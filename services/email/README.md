# Email Service

A dedicated microservice for handling all email communications across the Festive Event Management Platform. This service provides a centralized, scalable solution for sending templated emails with support for various email providers and comprehensive logging.

## 🚀 Features

### Core Functionality
- **Template-based Email Sending**: Pre-built HTML and text templates for all email types
- **Multiple Email Providers**: Support for Gmail, SMTP, and other email services
- **Attachment Support**: Send emails with file attachments
- **Bulk Email Support**: Send to multiple recipients simultaneously
- **Email Logging**: Comprehensive logging of all email activities
- **Connection Testing**: Verify email provider configuration

### Email Templates
- **User Management**: Registration, verification, password reset, invitations
- **Event Management**: Event invitations, reminders, updates
- **Invoice Management**: Invoice notifications, payment reminders
- **Vendor Management**: Assignment notifications, deliverable reminders

### Security & Reliability
- **Rate Limiting**: Prevent email abuse and spam
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Graceful error handling and logging
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable CORS settings

## 🏗️ Architecture

```
Email Service
├── Controllers (REST API endpoints)
├── Services (Business logic)
├── Templates (Email templates)
├── Routes (API routing)
├── Utils (Logging, validation)
└── Types (TypeScript interfaces)
```

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Email provider account (Gmail, SMTP, etc.)

## 🛠️ Installation

1. **Navigate to the email service directory:**
   ```bash
   cd services/email
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your email provider settings in `.env`**

## ⚙️ Configuration

### Environment Variables

```env
# Server Configuration
PORT=3005
NODE_ENV=development

# Email Provider Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@festive.com
EMAIL_REPLY_TO=support@festive.com

# Security
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Logging
LOG_LEVEL=info
```

### Email Provider Setup

#### Gmail Setup
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

#### SMTP Setup
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

## 🚀 Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Run Tests
```bash
npm test
```

## 📡 API Endpoints

### Email Sending Endpoints

#### Generic Email
```http
POST /api/email/send
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Custom Subject",
  "template": "user-registration",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "verificationUrl": "https://example.com/verify"
  }
}
```

#### User Registration Email
```http
POST /api/email/user-registration
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "verificationUrl": "https://example.com/verify"
}
```

#### Email Verification
```http
POST /api/email/email-verification
Content-Type: application/json

{
  "firstName": "John",
  "email": "john@example.com",
  "verificationUrl": "https://example.com/verify"
}
```

#### Password Reset
```http
POST /api/email/password-reset
Content-Type: application/json

{
  "firstName": "John",
  "email": "john@example.com",
  "resetUrl": "https://example.com/reset",
  "expiryHours": 24
}
```

#### User Invitation
```http
POST /api/email/user-invitation
Content-Type: application/json

{
  "email": "invitee@example.com",
  "inviterName": "John Doe",
  "roleName": "Project Manager",
  "acceptUrl": "https://example.com/accept",
  "expiryHours": 72
}
```

#### Event Invitation
```http
POST /api/email/event-invitation
Content-Type: application/json

{
  "email": "guest@example.com",
  "eventName": "Annual Conference",
  "eventDate": "2024-12-25",
  "eventLocation": "Convention Center",
  "inviterName": "John Doe",
  "acceptUrl": "https://example.com/accept",
  "declineUrl": "https://example.com/decline"
}
```

#### Event Reminder
```http
POST /api/email/event-reminder
Content-Type: application/json

{
  "email": "client@example.com",
  "eventName": "Annual Conference",
  "eventDate": "2024-12-25",
  "eventLocation": "Convention Center",
  "clientName": "Jane Smith",
  "daysUntilEvent": 7
}
```

#### Invoice Email
```http
POST /api/email/invoice
Content-Type: application/json

{
  "email": "client@example.com",
  "invoiceNumber": "INV-2024-001",
  "clientName": "Jane Smith",
  "total": 1500.00,
  "currency": "USD",
  "dueDate": "2024-12-31",
  "downloadUrl": "https://example.com/invoice.pdf"
}
```

#### Payment Reminder
```http
POST /api/email/payment-reminder
Content-Type: application/json

{
  "email": "client@example.com",
  "invoiceNumber": "INV-2024-001",
  "clientName": "Jane Smith",
  "amount": 1500.00,
  "currency": "USD",
  "dueDate": "2024-12-31",
  "overdueDays": 5,
  "paymentUrl": "https://example.com/pay"
}
```

#### Vendor Assignment
```http
POST /api/email/vendor-assignment
Content-Type: application/json

{
  "email": "vendor@example.com",
  "vendorName": "Catering Plus",
  "eventName": "Annual Conference",
  "eventDate": "2024-12-25",
  "eventLocation": "Convention Center",
  "services": ["Catering", "Setup", "Cleanup"],
  "contactPerson": "John Doe"
}
```

#### Deliverable Reminder
```http
POST /api/email/deliverable-reminder
Content-Type: application/json

{
  "email": "vendor@example.com",
  "deliverableName": "Final Menu",
  "eventName": "Annual Conference",
  "dueDate": "2024-12-20",
  "vendorName": "Catering Plus",
  "daysUntilDue": 3
}
```

### Management Endpoints

#### Get Email Statistics
```http
GET /api/email/stats
```

#### Get Email Logs
```http
GET /api/email/logs?limit=50
```

#### Get Email Log by ID
```http
GET /api/email/logs/:id
```

#### Get Available Templates
```http
GET /api/email/templates
```

#### Test Email Connection
```http
GET /api/email/test-connection
```

#### Clear Email Logs
```http
DELETE /api/email/logs
```

#### Health Check
```http
GET /health
```

## 📧 Email Templates

### Available Templates

1. **user-registration** - Welcome email for new user registration
2. **email-verification** - Email verification link
3. **password-reset** - Password reset link
4. **user-invitation** - User invitation to join platform
5. **event-invitation** - Event invitation to guests
6. **event-reminder** - Event reminder notifications
7. **invoice-sent** - Invoice notification
8. **payment-reminder** - Payment reminder for overdue invoices
9. **vendor-assignment** - Vendor assignment notification
10. **deliverable-reminder** - Deliverable due date reminder

### Template Features

- **Responsive Design**: Mobile-friendly email templates
- **Brand Consistency**: Consistent styling across all templates
- **Dynamic Content**: Handlebars templating for dynamic data
- **HTML & Text Versions**: Both HTML and plain text versions
- **Customizable**: Easy to modify colors, fonts, and layout

## 🔧 Integration

### With Other Services

The email service can be integrated with other microservices:

#### Auth Service Integration
```javascript
// Send registration email
await fetch('http://email-service:3005/api/email/user-registration', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    verificationUrl: 'https://app.com/verify?token=xyz'
  })
});
```

#### Event Service Integration
```javascript
// Send event reminder
await fetch('http://email-service:3005/api/email/event-reminder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'client@example.com',
    eventName: 'Annual Conference',
    eventDate: '2024-12-25',
    eventLocation: 'Convention Center',
    clientName: 'Jane Smith',
    daysUntilEvent: 7
  })
});
```

### Docker Integration

Add to your `docker-compose.yml`:

```yaml
email-service:
  build: ./services/email
  ports:
    - "3005:3005"
  environment:
    - EMAIL_HOST=smtp.gmail.com
    - EMAIL_PORT=587
    - EMAIL_USER=${EMAIL_USER}
    - EMAIL_PASS=${EMAIL_PASS}
    - EMAIL_FROM=noreply@festive.com
  depends_on:
    - postgres
```

## 📊 Monitoring & Logging

### Log Levels
- **ERROR**: Email sending failures, configuration issues
- **WARN**: Rate limiting, connection issues
- **INFO**: Email sent successfully, service startup
- **DEBUG**: Detailed request/response information

### Metrics
- Total emails sent
- Failed emails
- Pending emails
- Success rate
- Response times

### Health Checks
- Email provider connectivity
- Service availability
- Template validation

## 🔒 Security

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable limits for different endpoints

### Input Validation
- Email address validation
- URL validation
- Data type validation
- Template existence validation

### CORS Protection
- Configurable allowed origins
- Credential support
- Secure defaults

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set all required email provider credentials
   - Configure CORS origins
   - Set appropriate log levels

2. **Email Provider**
   - Use production SMTP server
   - Configure proper authentication
   - Set up monitoring and alerts

3. **Security**
   - Enable HTTPS
   - Configure firewall rules
   - Set up monitoring

4. **Monitoring**
   - Set up email delivery monitoring
   - Configure error alerting
   - Monitor rate limiting

### Docker Deployment

```bash
# Build the image
docker build -t festive-email-service .

# Run the container
docker run -d \
  --name email-service \
  -p 3005:3005 \
  -e EMAIL_HOST=smtp.gmail.com \
  -e EMAIL_USER=your-email@gmail.com \
  -e EMAIL_PASS=your-app-password \
  festive-email-service
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Manual Testing
Use the test connection endpoint to verify email provider configuration:

```bash
curl http://localhost:3005/api/email/test-connection
```

## 📝 Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check email provider credentials
   - Verify SMTP settings
   - Check firewall/network settings

2. **Template Not Found**
   - Verify template name
   - Check template file exists
   - Validate template syntax

3. **Rate Limiting**
   - Check request frequency
   - Verify rate limit configuration
   - Monitor IP addresses

4. **Connection Issues**
   - Test email provider connectivity
   - Check network configuration
   - Verify SSL/TLS settings

### Debug Mode

Enable debug logging:

```env
LOG_LEVEL=debug
```

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Test email templates thoroughly

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review the logs for error details
- Test email provider connectivity
- Verify environment configuration 