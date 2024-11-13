package main

import (
	"fmt"
)

func commandMap(cfg *Config, args ...string) error {

	res, err := cfg.pokeClient.ListLocations(cfg.nextUrl)
	if err != nil {
		return err
	}

	fmt.Println("Locations:")
	for _, loc := range res.Results {
		fmt.Printf("\t-%v\n", loc.Name)
	}
	cfg.nextUrl = res.Next
	cfg.prevUrl = res.Previous
	return nil
}

func commandMapB(cfg *Config, args ...string) error {
	if cfg.prevUrl == nil {
		return fmt.Errorf("you are on the first page")
	}

	res, err := cfg.pokeClient.ListLocations(cfg.prevUrl)
	if err != nil {
		return err
	}

	fmt.Println("Locations:")
	for _, loc := range res.Results {
		fmt.Printf("\t-%v\n", loc.Name)
	}
	cfg.nextUrl = res.Next
	cfg.prevUrl = res.Previous
	return nil
}
