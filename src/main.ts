import { wordlist } from "./wordlist.js";
import * as readline from 'node:readline/promises';
import { CompareResult } from "./compare.js";
import { StateFilters } from "./state_filters.js";
import { getNextGuess } from './next_guess.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    let currentGuess = getNextGuess(wordlist);
    let remainingWords = wordlist;
    const stateFilters = new StateFilters();
    while (remainingWords.length > 1) {
        const compareResultStr = await rl.question('\nWhat is the current state? ');
        stateFilters.addCompareResult(CompareResult.fromString(currentGuess, compareResultStr));
        remainingWords = remainingWords.filter(
            (word) => stateFilters.matches(word));
        if (remainingWords.length === 0) {
            throw new Error('No remaining words');
        }
        if (remainingWords.length === 1) {
            currentGuess = remainingWords[0];
            console.log(`Solved wordle: "${currentGuess}"`);
            return;
        }
        console.log(remainingWords);
        console.log(`${remainingWords.length} words remaining`);

        currentGuess = getNextGuess(remainingWords);
    }
}
main();