package main

import "os"

func commandExit(cfg *Config) error {
	os.Exit(0)
	return nil
}
