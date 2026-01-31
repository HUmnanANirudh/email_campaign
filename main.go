package main

import (
	"fmt"
	"runtime"
	"sync"
)

func main() {
	recipientChannel := make(chan Recipient);
	go func() {
	err := loadRecipients("./email.csv",recipientChannel)
	if err != nil {
		fmt.Println("Error loading recipients:", err)
	}
}()
	var wg sync.WaitGroup;
	workerCount := runtime.NumCPU();
	for i:=1; i<=workerCount; i++ {
		wg.Add(1)
		go emailWorker(i, recipientChannel,&wg);
	}
	wg.Wait()
}