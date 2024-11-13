package main

import (
	"errors"
	"fmt"
	"math/rand"
)

func commandCatch(cfg *Config, args ...string) error {
	if len(args) != 1 {
		return errors.New("incorrect number of arguments")
	}

	pokemonName := args[0]

	pokemon, err := cfg.pokeClient.GetPokemon(pokemonName)
	if err != nil {
		return fmt.Errorf("error getting pokemon: %v", err)
	}

	const threshhold = 50
	catchChance := rand.Intn(pokemon.BaseExperience)
	if catchChance > threshhold {
		return fmt.Errorf("failed to catch %s", pokemon.Name)
	}

	fmt.Printf("%s was caught\n", pokemon.Name)
	cfg.caughtPokemon[args[0]] = pokemon

	return nil
}
