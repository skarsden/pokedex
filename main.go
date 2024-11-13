package main

import (
	"time"

	"github.com/skarsden/pokedex/internal/pokeapi"
)

func main() {
	cfg := Config{
		pokeClient:    pokeapi.NewClient(time.Hour),
		nextUrl:       nil,
		prevUrl:       nil,
		caughtPokemon: make(map[string]pokeapi.Pokemon),
	}
	startRepl(&cfg)
}

type Config struct {
	pokeClient    pokeapi.Client
	nextUrl       *string
	prevUrl       *string
	caughtPokemon map[string]pokeapi.Pokemon
}
