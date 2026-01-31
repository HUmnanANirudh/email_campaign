package main

import "fmt"

func main() {
	err := loadRecipients("./email_campaign_test.csv")
	if err != nil {
		fmt.Println("Error loading recipients:", err)
	}
}