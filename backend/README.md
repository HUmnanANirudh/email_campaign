# Email Campaign Backend - Go Service

## Project Structure

```
backend/
├── main.go                 # Entry point, HTTP server setup
├── models/                 # Data structures
│   └── campaign.go         # Campaign, Recipient, EmailJob, EmailResult models
├── handlers/               # HTTP request handlers
│   └── campaign_handler.go # Campaign API endpoint logic
├── services/               # Business logic
│   └── email_service.go    # Email template rendering & SendGrid integration
├── workers/                # Producer-Consumer pattern
│   ├── producer.go         # Produces email jobs from recipients
│   └── consumer.go         # Consumes jobs and sends emails
├── go.mod                  # Go module definition
```

## Architecture

### Producer-Consumer Pattern

1. **Producer** (`workers/producer.go`)
   - Receives campaign data (recipients, template, API key)
   - Creates email jobs for each recipient
   - Sends jobs to the `jobs` channel
   - Closes channel when all jobs are queued

2. **Consumer** (`workers/consumer.go`)
   - Multiple workers (based on CPU cores) running concurrently
   - Each worker reads from the `jobs` channel
   - For each job:
     - Renders email template with recipient data
     - Sends email via SendGrid API
     - Sends result to `results` channel
   - Continues until `jobs` channel is closed

3. **Flow**:
   ```
   HTTP Request → Handler → Producer → Jobs Channel
                                           ↓
                                     Consumer Workers (CPU cores)
                                           ↓
                                    Results Channel → Response
   ```

## Components

### Models (`models/campaign.go`)
- `Recipient` - Email recipient data (Name, Email)
- `CampaignRequest` - HTTP request payload
- `CampaignResponse` - HTTP response payload
- `EmailJob` - Job sent to workers
- `EmailResult` - Result from workers

### Handlers (`handlers/campaign_handler.go`)
- `HandleCampaign` - HTTP endpoint `/api/campaign`
- `ProcessCampaign` - Orchestrates producer-consumer workflow
- `EnableCORS` - CORS middleware

### Services (`services/email_service.go`)
- `ExecuteTemplate` - Renders Go templates with recipient data
- `SendViaSendGrid` - Sends email via SendGrid API

### Workers
- `Producer` - Creates jobs from recipients
- `Consumer` - Processes jobs concurrently

## Running the Server

```bash
cd backend
go run .
```

Server starts on `http://localhost:8080`

## API Endpoint

### POST `/api/campaign`

**Request:**
```json
{
  "recipients": [
    {"Name": "John", "Email": "john@example.com"}
  ],
  "subject": "Hello, {{.Name}}!",
  "body": "<h1>Hi {{.Name}}</h1>",
  "apiKey": "SG.your-api-key"
}
```

**Response:**
```json
{
  "sent": 1,
  "failed": 0,
  "total": 1,
  "errors": []
}
```

## Template Variables

Use Go template syntax:
- `{{.Name}}` - Recipient name
- `{{.Email}}` - Recipient email

## Configuration

- **Port**: 8080 (hardcoded in `main.go`)
- **Worker Count**: `runtime.NumCPU()` (auto-detected)
- **CORS**: Enabled for all origins (`*`)
- **From Email**: `noreply@yourdomain.com` (in `services/email_service.go`)

## Environment

No environment variables required. SendGrid API key is sent from frontend.
