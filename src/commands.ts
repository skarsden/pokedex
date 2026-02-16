import { StatementSync } from "node:sqlite";
import { CLICommand, State } from "./state.js";

//Command registry------------------------------------------
export function getCommands(): Record<string, CLICommand> {
    return {
        help: {
            name: "help",
            description: "Displats a help message",
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
        }
    };
}
//Command registry------------------------------------------

//Command functions-----------------------------------------
export async function commandExit(state: State) {
    console.log("Closing the Pokedex... Goodbye!");
    state.readline.close();
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
//Command functions-----------------------------------------