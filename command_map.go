package main

import (
	"fmt"
)

func commandMap(cfg *Config) error {

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

func commandMapB(cfg *Config) error {
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
