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