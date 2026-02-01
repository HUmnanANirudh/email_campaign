package models

type Recipient struct {
	Name  string `json:"Name"`
	Email string `json:"Email"`
}

type CampaignRequest struct {
	Recipients []Recipient `json:"recipients"`
	Subject    string      `json:"subject"`
	Body       string      `json:"body"`
	ApiKey     string      `json:"apiKey"`
	FromEmail  string      `json:"fromEmail"`
	FromName   string      `json:"fromName,omitempty"`
}

type CampaignResponse struct {
	Sent   int      `json:"sent"`
	Failed int      `json:"failed"`
	Total  int      `json:"total"`
	Errors []string `json:"errors,omitempty"`
}

type EmailJob struct {
	Recipient Recipient
	Subject   string
	Body      string
	ApiKey    string
	FromEmail string
	FromName  string
}

type EmailResult struct {
	Email   string
	Success bool
	Error   string
}
