import { createInterface, type Interface } from "readline";
import { getCommands } from "./commands.js";
import { PokeAPI } from "./pokeapi.js";
import type { Pokemon } from "./pokeapi.js";

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => Promise<void>;
}

export type State = {
    readline: Interface;
    commands: Record<string, CLICommand>;
    pokeAPI: PokeAPI;
    next: string;
    prev: string;
    caughtPokemon: Record<string, Pokemon>;
}

export function initState(cacheInterval: number): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Pokedex > ",
    });

    return {
        readline: rl,
        commands: getCommands(),
        pokeAPI: new PokeAPI(cacheInterval),
        next: "",
        prev: "",
        caughtPokemon: {},
    }
}
