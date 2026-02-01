package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/HUmnanANirudh/email_campaign/handlers"
)

func main() {
	http.HandleFunc("/api/campaign", handlers.EnableCORS(handlers.HandleCampaign))

	port := ":8080"
	fmt.Printf("Server starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
