package main

import (
	"encoding/csv"
	"fmt"
	"os"
)
type Recipient struct {
	Name string
	Email string
}

func loadRecipients(filepath string) error {

	f, err := os.Open(filepath);
	if err != nil {
		return err;
	}

	r:=csv.NewReader(f);
	records, err := r.ReadAll();
	if err != nil {
		return err;
	}
	var recipients []Recipient;
	for _, record := range records[1:] {
		recipients = append(recipients, Recipient{
			Name:  record[0],
			Email: record[1],
		})
		fmt.Println(recipients[len(recipients)-1])
	}

	return nil;
}