package main

import (
	"errors"
	"fmt"
)

func commandInspect(cfg *Config, args ...string) error {
	if len(args) != 1 {
		return errors.New("incorrect number of arguments")
	}

	pokemonName := args[0]

	pokemon, ok := cfg.caughtPokemon[pokemonName]
	if !ok {
		return fmt.Errorf("%s has not been caught", pokemonName)
	}

	fmt.Printf("Name: %v\n", pokemon.Name)
	fmt.Printf("Height: %v\n", pokemon.Height)
	fmt.Printf("Weight: %v\n", pokemon.Weight)

	fmt.Println("Stats: ")
	fmt.Printf("\tHP: %v\n", pokemon.Stats[0].BaseStat)
	fmt.Printf("\tATK: %v\n", pokemon.Stats[1].BaseStat)
	fmt.Printf("\tDEF: %v\n", pokemon.Stats[2].BaseStat)
	fmt.Printf("\tSP.ATK: %v\n", pokemon.Stats[3].BaseStat)
	fmt.Printf("\tSP.DEF: %v\n", pokemon.Stats[4].BaseStat)
	fmt.Printf("\tSPD: %v\n", pokemon.Stats[5].BaseStat)

	fmt.Println("Types: ")
	fmt.Printf("\t-%v\n", pokemon.Types[0].Type.Name)
	if len(pokemon.Types) > 1 {
		fmt.Printf("\t-%v\n", pokemon.Types[1].Type.Name)
	}

	pokemon, err := cfg.pokeClient.GetPokemon(args[0])
	if err != nil {
		return fmt.Errorf("error getting pokemon: %v", err)
	}

	return nil
}
