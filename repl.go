package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func startRepl(cfg *Config) {
	scanner := bufio.NewScanner(os.Stdin)

	for {
		fmt.Print("Pokedex > ")
		scanner.Scan()
		text := scanner.Text()

		cleaned := cleanInput(text)

		if len(cleaned) == 0 {
			continue
		}

		commandName := cleaned[0]
		args := []string{}
		if len(cleaned) > 1 {
			args = cleaned[1:]
		}

		commands := getCommands()

		cmd, ok := commands[commandName]
		if !ok {
			fmt.Println("Invalid Command")
			continue
		}
		err := cmd.callback(cfg, args...)
		if err != nil {
			fmt.Println(err)
		}
	}
}

type Command struct {
	name        string
	description string
	callback    func(*Config, ...string) error
}

func getCommands() map[string]Command {
	return map[string]Command{
		"help": {
			name:        "help",
			description: "Prints out help menu",
			callback:    commandHelp,
		},
		"map": {
			name:        "map",
			description: "Prints out next page of locations",
			callback:    commandMap,
		},
		"mapb": {
			name:        "mapb",
			description: "Prints out previous page of locations",
			callback:    commandMapB,
		},
		"explore": {
			name:        "explore {location area name}",
			description: "Prints out Pokemon from the given area",
			callback:    commandExplore,
		},
		"catch": {
			name:        "catch {pokemon name}",
			description: "Attempts to catch the given pokemon",
			callback:    commandCatch,
		},
		"inspect": {
			name:        "inspect {pokemon name}",
			description: "Prints details of given pokemon if the user has caught it with the Catch command",
			callback:    commandInspect,
		},
		"pokedex": {
			name:        "pokedex",
			description: "Prints names of all caught pokemon",
			callback:    commandPokedex,
		},
		"exit": {
			name:        "exit",
			description: "Exits the Pokedex",
			callback:    commandExit,
		},
	}
}

func cleanInput(str string) []string {
	lowerCase := strings.ToLower(str)
	words := strings.Fields(lowerCase)
	return words
}
