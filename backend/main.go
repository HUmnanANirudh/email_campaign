package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"github.com/HUmnanANirudh/email_campaign/handlers"
)

func main() {
	http.HandleFunc("/api/campaign", handlers.EnableCORS(handlers.HandleCampaign))
	publicDir := "./public"
	if _, err := os.Stat(publicDir); err == nil {
		fs := http.FileServer(http.Dir(publicDir))
		http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			path := filepath.Join(publicDir, r.URL.Path)
			if _, err := os.Stat(path); os.IsNotExist(err) {
				http.ServeFile(w, r, filepath.Join(publicDir, "index.html"))
				return
			}
			fs.ServeHTTP(w, r)
		})
		fmt.Println("Serving frontend from", publicDir)
	} else {
		fmt.Println("Frontend not found, API-only mode")
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
