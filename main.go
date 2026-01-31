package main

import (
	"fmt"
	"time"
)

func main() {
	recipientChannel := make(chan Recipient);
	go func() {
		defer close(recipientChannel)
	err := loadRecipients("./email.csv",recipientChannel)
	if err != nil {
		fmt.Println("Error loading recipients:", err)
	}
}()
	emailWorker(1, recipientChannel)

	time.Sleep(3*time.Second)
}