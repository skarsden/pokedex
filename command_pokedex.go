package main

import "fmt"

func commandPokedex(cfg *Config, args ...string) error {
	if len(cfg.caughtPokemon) == 0 {
		return fmt.Errorf("you have not caught any pokemon")
	}

	for k := range cfg.caughtPokemon {
		fmt.Printf("\t-%v\n", k)
	}
	return nil
}
