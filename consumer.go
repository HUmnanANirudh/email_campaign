package main

import (
	"fmt"
	"net/smtp"
	"sync"
	"time"
)

func emailWorker(id int, ch chan Recipient, wg *sync.WaitGroup) {
	defer wg.Done()
	for recipient := range ch {
		smtpHost := "localhost"
		smtpPort := "1025"

		// formattedMsg := fmt.Sprintf("To: %s\r\nSubject: Hello %s\r\n\r\nThis is a test email.\r\n", recipient.Email, recipient.Name)
		// msg := []byte(formattedMsg)

		msg,err := executeTemplate(recipient)
		if err != nil {
			fmt.Printf("Worker %d: Failed to execute template for %s: %v\n", id, recipient.Email, err)
			continue
		}
		err = smtp.SendMail(smtpHost+ ":" + smtpPort,nil,"tanirudhganesh@gmail.com",[]string{recipient.Email},[]byte(msg))
		if err != nil {
			fmt.Printf("Worker %d: Failed to send email to %s: %v\n", id, recipient.Email, err)
			continue
		}
		time.Sleep(50*time.Millisecond)
		fmt.Printf("Worker %d: Name=%s, Email=%s\n", id, recipient.Name, recipient.Email)
	}
}
