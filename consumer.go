package main

import (
	"fmt"
)

func emailWorker(id int, ch chan Recipient) {
	for recipient := range ch {
		fmt.Printf("Worker %d: Name=%s, Email=%s\n", id, recipient.Name, recipient.Email)
	}
}
