package workers

import (
	"github.com/HUmnanANirudh/email_campaign/models"
)

// Producer sends email jobs to the job channel
func Producer(jobs chan<- models.EmailJob, recipients []models.Recipient, subject, body, apiKey, fromEmail, fromName string) {
	defer close(jobs)

	for _, recipient := range recipients {
		job := models.EmailJob{
			Recipient: recipient,
			Subject:   subject,
			Body:      body,
			ApiKey:    apiKey,
			FromEmail: fromEmail,
			FromName:  fromName,
		}
		jobs <- job
	}
}
