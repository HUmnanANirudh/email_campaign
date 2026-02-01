# MailFlow

A email campaign platform that sends personalized emails to multiple recipients using SendGrid. Built with Go backend and React frontend.Using a producer-consumer pattern for parallel email processing.

<img width="1855" height="870" alt="image" src="https://github.com/user-attachments/assets/2c5ac3f9-6df7-4764-971c-9705db1a3b00" />

## Architecture

```
Frontend (React + TypeScript)
     ↓ POST /api/campaign
Backend (Go)
     ↓ Producer-Consumer Pattern
Worker Pool (CPU cores)
     ↓ SendGrid API
Recipients receive emails
```

### Producer-Consumer Pattern

- **Producer**: Creates email jobs from CSV recipients
- **Consumer Workers**: Multiple goroutines (one per CPU core) send emails in parallel
- **Channels**: Buffered Go channels for job distribution and result collection

## Tech Stack

### Backend
- **Language**: Go 1.25.5
- **Architecture**: Producer-Consumer with goroutines
- **Email Service**: SendGrid API
- **Server**: Native `net/http`

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React

## Quick Start
### Prerequisites
- Go 1.23+ (for backend development)
- Node.js 20+ (for frontend development)
- Docker (for containerized deployment)
- SendGrid API Key with verified sender domain

### Local Development

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd email_campaign
```

#### 2. Run Backend
```bash
cd backend
go run .
```
Backend starts on http://localhost:8080

#### 3. Run Frontend (separate terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend starts on http://localhost:5173

#### 4. Access the Application
Open http://localhost:5173 in your browser

### Docker Deployment

#### Local Docker
```bash
docker-compose up --build

# Access at http://localhost:8080
```

#### Railway Deployment
1. Push code to GitHub
2. Create new Railway project
3. Connect GitHub repository
4. Railway auto-detects `Dockerfile` and deploys
5. Access your app at the Railway-provided URL

**That's it!** No environment variables needed for basic deployment.

## Usage Guide

### 1. Prepare CSV File

Create a CSV with recipient data. Required columns:
- `Name` - Recipient's name
- `Email` - Recipient's email address

You can add custom columns for template personalization.

**Example CSV:**
```csv
Name,Email
John Doe,john@example.com
Jane Smith,jane@example.com
```

### 2. Create Email Template

Use Go template syntax to personalize emails:

**Subject:**
```
Welcome to our service, {{.Name}}!
```

**Body:**
```html
<h1>Hi {{.Name}},</h1>
<p>Thank you for joining us{{if .Company}} from {{.Company}}{{end}}!</p>
<p>We're excited to have you.</p>
```

### 3. Configure SendGrid

1. Get your SendGrid API key from [SendGrid Dashboard](https://app.sendgrid.com/)
2. Verify your sender domain in SendGrid
3. Enter:
   - API Key
   - Sender Email (must be verified in SendGrid)
   - Sender Name (optional)

### 4. Launch Campaign

Click "Launch Campaign" and watch real-time progress:
- Sent count
- Failed count
- Pending count

Download error logs if any emails fail.

## Project Structure

```
email_campaign/
├── backend/                 # Go backend
│   ├── main.go             # Entry point, HTTP server
│   ├── handlers/           # HTTP request handlers
│   │   └── campaign_handler.go
│   ├── models/             # Data structures
│   │   └── campaign.go
│   ├── services/           # Business logic
│   │   └── email_service.go
│   └── workers/            # Producer-Consumer pattern
│       ├── producer.go
│       └── consumer.go
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── campaign/   # Campaign-specific components
│   │   │   └── ui/         # Reusable UI components
│   │   └── lib/            # Utilities
│   ├── package.json
│   └── vite.config.ts
├── Dockerfile              # Multi-stage build (frontend + backend)
├── docker-compose.yml      # Local Docker setup
└── README.md              # This file
```

## API Documentation

### POST `/api/campaign`

Send an email campaign to multiple recipients.

**Request:**
```json
{
  "recipients": [
    {"Name": "John Doe", "Email": "john@example.com"},
    {"Name": "Jane Smith", "Email": "jane@example.com"}
  ],
  "subject": "Hello, {{.Name}}!",
  "body": "<h1>Hi {{.Name}}</h1><p>Welcome!</p>",
  "apiKey": "SG.your-sendgrid-api-key",
  "fromEmail": "noreply@yourdomain.com",
  "fromName": "Your Company"
}
```

**Response:**
```json
{
  "sent": 2,
  "failed": 0,
  "total": 2,
  "errors": []
}
```

## Configuration

### Backend

The backend automatically uses the `PORT` environment variable if available (for Railway/Heroku), otherwise defaults to `8080`.

**Environment Variables:**
- `PORT` - Server port (default: 8080)

### Frontend

For local development, create a `.env` file:

```bash
# Optional: Only needed for local dev when running frontend separately
VITE_BACKEND_URL=http://localhost:8080
```
### Common Issues

**"SendGrid API returned status 403"**
- Check if your API key has "Mail Send" permissions
- Verify sender email domain in SendGrid
