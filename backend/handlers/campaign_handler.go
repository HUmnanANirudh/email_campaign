package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"runtime"
	"sync"

	"github.com/HUmnanANirudh/email_campaign/models"
	"github.com/HUmnanANirudh/email_campaign/workers"
)

func EnableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func HandleCampaign(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.CampaignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if len(req.Recipients) == 0 {
		http.Error(w, "No recipients provided", http.StatusBadRequest)
		return
	}

	result := ProcessCampaign(req)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func ProcessCampaign(req models.CampaignRequest) models.CampaignResponse {
	// Create channels for producer-consumer pattern
	jobs := make(chan models.EmailJob, len(req.Recipients))
	results := make(chan models.EmailResult, len(req.Recipients))

	// Use default sender name if not provided
	fromName := req.FromName
	if fromName == "" {
		fromName = "Campaign Sender"
	}

	// Start producer goroutine
	go workers.Producer(jobs, req.Recipients, req.Subject, req.Body, req.ApiKey, req.FromEmail, fromName)

	// Start consumer workers
	var wg sync.WaitGroup
	workerCount := runtime.NumCPU()
	if workerCount > len(req.Recipients) {
		workerCount = len(req.Recipients)
	}

	fmt.Printf("Starting %d workers to process %d recipients\n", workerCount, len(req.Recipients))

	for i := 1; i <= workerCount; i++ {
		wg.Add(1)
		go workers.Consumer(i, jobs, results, &wg)
	}

	// Wait for all workers to finish and close results channel
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results
	response := models.CampaignResponse{
		Total:  len(req.Recipients),
		Errors: []string{},
	}

	for result := range results {
		if result.Success {
			response.Sent++
		} else {
			response.Failed++
			response.Errors = append(response.Errors, fmt.Sprintf("%s: %s", result.Email, result.Error))
		}
	}

	fmt.Printf("Campaign completed: %d sent, %d failed out of %d total\n", response.Sent, response.Failed, response.Total)

	return response
}
