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
            description: "get the previous page of locations",
            callback: commandMapBackward
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
//Command functions-----------------------------------------