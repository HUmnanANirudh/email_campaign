package main

import (
	"encoding/csv"
	"os"
)
type Recipient struct {
	Name string
	Email string
}

func loadRecipients(filepath string, ch chan Recipient) error {

	f, err := os.Open(filepath);
	if err != nil {
		return err;
	}
	defer f.Close();
	r:=csv.NewReader(f);
	records, err := r.ReadAll();
	if err != nil {
		return err;
	}
	for _, record := range records[1:] {
		ch <- Recipient{
			Name:  record[0],
			Email: record[1],
		}
	}

	return nil;
}