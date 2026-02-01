package workers

import (
	"fmt"
	"sync"

	"github.com/HUmnanANirudh/email_campaign/models"
	"github.com/HUmnanANirudh/email_campaign/services"
)

// Consumer processes email jobs from the job channel
func Consumer(id int, jobs <-chan models.EmailJob, results chan<- models.EmailResult, wg *sync.WaitGroup) {
	defer wg.Done()

	for job := range jobs {
		result := models.EmailResult{
			Email: job.Recipient.Email,
		}

		// Execute templates
		parsedSubject, parsedBody, err := services.ExecuteTemplate(job.Subject, job.Body, job.Recipient)
		if err != nil {
			result.Success = false
			result.Error = fmt.Sprintf("Template error: %v", err)
			fmt.Printf("Worker %d: Failed to execute template for %s: %v\n", id, job.Recipient.Email, err)
			results <- result
			continue
		}

		// Send via SendGrid
		err = services.SendViaSendGrid(job.Recipient.Email, job.Recipient.Name, parsedSubject, parsedBody, job.ApiKey, job.FromEmail, job.FromName)
		if err != nil {
			result.Success = false
			result.Error = err.Error()
			fmt.Printf("Worker %d: Failed to send email to %s: %v\n", id, job.Recipient.Email, err)
		} else {
			result.Success = true
			fmt.Printf("Worker %d: Successfully sent email to %s (%s)\n", id, job.Recipient.Name, job.Recipient.Email)
		}

		results <- result
	}
}
