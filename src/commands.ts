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
    };
}
//Command registry------------------------------------------

//Command functions-----------------------------------------
export function commandExit(state: State) {
    console.log("Closing the Pokedex... Goodbye!");
    state.readline.close();
    process.exit(0);
}

export function commandHelp(state: State) {
    console.log("\nWelcome to the Pokedex!");
    console.log("Usage:\n");
    for (const cmd of Object.values(state.commands)) {
        console.log(`${cmd.name}: ${cmd.description}`);
    }
    console.log();
}
//Command functions-----------------------------------------