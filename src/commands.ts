import { StatementSync } from "node:sqlite";
import { CLICommand, State } from "./state.js";

//Command registry------------------------------------------
export function getCommands(): Record<string, CLICommand> {
    return {
        help: {
            name: "help",
            description: "Displays a help message",
            callback: commandHelp,
        },
        exit: {
            name: "exit",
            description: "Exit the Pokedex",
            callback: commandExit,
        },
        map: {
            name: "map",
            description: "Get the next page of locations",
            callback: commandMapForward,
        },
        mapb: {
            name: "mapb",
            description: "Get the previous page of locations",
            callback: commandMapBackward
        },
        explore: {
            name: "explore <location name>",
            description: "Get the pokemon that can be found in the specified location",
            callback: commandExplore
        },
        catch: {
            name: "catch <pokemon name>",
            description: "Catch a speficied pokemon",
            callback: commandCatch
        },
        inspect: {
            name: "inspect <pokemon name>",
            description: "Inspect a pokemon that has been caught",
            callback: commandInspect
        },
        pokedex: {
            name: "pokedex",
            description: "See all the Pokemon that have been caught",
            callback: commandPokedex
        }
    };
}
//Command registry------------------------------------------

//Command functions-----------------------------------------
export async function commandExit(state: State) {
    console.log("Closing the Pokedex... Goodbye!");
    state.readline.close();
    state.pokeAPI.closeCache();
    process.exit(0);
}

export async function commandHelp(state: State) {
    console.log("\nWelcome to the Pokedex!");
    console.log("Usage:\n");
    for (const cmd of Object.values(state.commands)) {
        console.log(`${cmd.name}: ${cmd.description}`);
    }
    console.log();
}

export async function commandMapForward(state: State) {
    const locations = await state.pokeAPI.fetchLocations(state.next);
    state.next = locations.next;
    state.prev = locations.previous;

    for (const loc of locations.results) {
        console.log(loc.name);
    }
}

export async function commandMapBackward(state: State) {
    const locations = await state.pokeAPI.fetchLocations(state.prev);
    state.next = locations.next;
    state.prev = locations.previous;

    for (const loc of locations.results) {
        console.log(loc.name);
    }
}

export async function commandExplore(state: State, ...args: string[]) {
    if(args.length < 1) {
        throw new Error("You must provide a location name");
    }

    const locationName = args[0];
    console.log(`Exploring ${locationName}...`);
    const encounters = (await state.pokeAPI.fetchLocation(locationName)).pokemon_encounters;
    console.log("Found Pokemon:");

    for(const encounter of encounters) {
        console.log(`- ${encounter.pokemon.name}`);
    }
}

export async function commandCatch(state: State, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("you must provide a pokemon name");
    }

    const pokemon = await state.pokeAPI.fetchPokemon(args[0]);
    console.log(`Throwing a Pokeball at ${pokemon.name}...`);

    const res = Math.floor(Math.random() * pokemon.base_experience);
    if(res > 40) {
        console.log(`${pokemon.name} escaped!`);
        return;
    }

    console.log(`${pokemon.name} was caught!`);
    console.log("You may now inspect it with the inspect command.");
    state.caughtPokemon[pokemon.name] = pokemon;
}

export async function commandInspect(state: State, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("You must provide a pokemon name");
    }
    const pokemonName = args[0];

    if (state.caughtPokemon[pokemonName] === undefined) {
        console.log("You have not caught that pokemon yet");
        return;
    }

    const pokemon = state.caughtPokemon[pokemonName];

    console.log(`Name: ${pokemon.name}`);
    console.log(`Height: ${pokemon.height}`);
    console.log(`Weight: ${pokemon.weight}`);
    console.log("Stats:");
    for (const stat of pokemon.stats) {
        console.log(`  -${stat.stat.name}: ${stat.base_stat}`);
    }
    console.log("Types:");
    for (const type of pokemon.types) {
    console.log(`  - ${type.type.name}`);
    }
}

export async function commandPokedex(state: State) {
    console.log("Your Pokedex:");
    for (const pokemon of Object.values(state.caughtPokemon)) {
        console.log(` - ${pokemon.name}`);
    }
}
//Command functions-----------------------------------------