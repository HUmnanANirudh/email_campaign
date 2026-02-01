package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"

	"github.com/HUmnanANirudh/email_campaign/models"
)

type SendGridMessage struct {
	Personalizations []Personalization `json:"personalizations"`
	From             EmailAddress      `json:"from"`
	Content          []Content         `json:"content"`
}

type Personalization struct {
	To      []EmailAddress `json:"to"`
	Subject string         `json:"subject"`
}

type EmailAddress struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type Content struct {
	Type  string `json:"type"`
	Value string `json:"value"`
}

// ExecuteTemplate renders the email subject and body with recipient data
func ExecuteTemplate(subject, body string, r models.Recipient) (string, string, error) {
	// Parse subject template
	subjectTmpl, err := template.New("subject").Parse(subject)
	if err != nil {
		return "", "", err
	}
	var subjectBuf bytes.Buffer
	if err := subjectTmpl.Execute(&subjectBuf, r); err != nil {
		return "", "", err
	}

	// Parse body template
	bodyTmpl, err := template.New("body").Parse(body)
	if err != nil {
		return "", "", err
	}
	var bodyBuf bytes.Buffer
	if err := bodyTmpl.Execute(&bodyBuf, r); err != nil {
		return "", "", err
	}

	return subjectBuf.String(), bodyBuf.String(), nil
}

// SendViaSendGrid sends an email using the SendGrid API
func SendViaSendGrid(toEmail, toName, subject, htmlBody, apiKey, fromEmail, fromName string) error {
	message := SendGridMessage{
		Personalizations: []Personalization{
			{
				To: []EmailAddress{
					{Email: toEmail, Name: toName},
				},
				Subject: subject,
			},
		},
		From: EmailAddress{
			Email: fromEmail,
			Name:  fromName,
		},
		Content: []Content{
			{
				Type:  "text/html",
				Value: htmlBody,
			},
		},
	}

	jsonData, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %v", err)
	}

	req, err := http.NewRequest("POST", "https://api.sendgrid.com/v3/mail/send", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return nil
	}

	return fmt.Errorf("SendGrid API returned status %d", resp.StatusCode)
}
