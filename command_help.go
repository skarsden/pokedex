package main

import "fmt"

func commandHelp(cfg *Config, args ...string) error {
	fmt.Println("Welcome to the Pokedex")
	fmt.Println("Here are your available commands:")
	commands := getCommands()
	for _, cmd := range commands {
		fmt.Printf("\t-%v\n\t\t-%v\n", cmd.name, cmd.description)
	}
	return nil
}
