export type CLICommand = {
    name: string;
    description: string;
    callback: (commands: Record<string, CLICommand>) => void;
}

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
export function commandExit() {
    console.log("Closing the Pokedex... Goodbye!");
    process.exit(0);
}

export function commandHelp(commands: Record<string, CLICommand>) {
    console.log("\nWelcome to the Pokedex!");
    console.log("Usage:\n");
    for (const cmd of Object.values(commands)) {
        console.log(`${cmd.name}: ${cmd.description}`);
    }
    console.log();
}
//Command functions-----------------------------------------