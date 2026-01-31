package main

import "fmt"

func main() {
	err := loadRecipients("./email.csv")
	if err != nil {
		fmt.Println("Error loading recipients:", err)
	}
}