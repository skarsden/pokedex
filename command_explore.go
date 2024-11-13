package main

import (
	"errors"
	"fmt"
)

func commandExplore(cfg *Config, args ...string) error {
	if len(args) != 1 {
		return errors.New("incorrect number of arguments")
	}

	locationInfo, err := cfg.pokeClient.GetLocationInfo(args[0])
	if err != nil {
		return fmt.Errorf("error getting pokemon: %v", err)
	}

	fmt.Printf("Pokemon in %s:\n", locationInfo.Name)
	for _, enc := range locationInfo.PokemonEncounters {
		fmt.Printf("\t-%v\n", enc.Pokemon.Name)
	}
	return nil
}
