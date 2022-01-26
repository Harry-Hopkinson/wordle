const prompts = require("prompts");
const chalk = require("chalk");
const wordList = require("./words.json")

var puzzle = "";

const wordlePrompt = {
    type: "text",
    name: "word",
    message: "Enter a 5 Letter Word...",
    validate: value => value.length != 5 ? "Word must be 5 Letters" : true
};

async function check(guess: { [x: string]: any; }) {
    var results = [];

    for (let i in guess) {
        var attempt = { letter: guess[i], color: "bgGrey" };
        
        if (attempt.letter === puzzle[i]) {
            process.stdout.write(chalk.white.bgGreen.bold(` ${guess[i]} \t`));
            continue; 
        }

        if (puzzle.includes(attempt.letter)) {
            process.stdout.write(chalk.white.bgYellow.bold(` ${guess[i]} \t`));
            continue;
        }
        process.stdout.write(chalk.white.bgGrey.bold(` ${guess[i]} \t`));
    }
    return results;
}