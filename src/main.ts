import { wordlist } from "./wordlist.js";
import * as readline from 'node:readline/promises';
import { CompareResult } from "./compare.js";
import { StateFilters } from "./state_filters.js";
import { getNextGuess } from './next_guess.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const groups = new Array(Math.pow(3, 5));

async function main() {

    const startingWord = getNextGuess(wordlist);
    console.log(`Starting word: ${startingWord}`);

    let remainingWords = wordlist.filter((word) => word !== startingWord);
    let remainingWordsSet = new Set(remainingWords);
    let currentWord = startingWord;
    const stateFilters = new StateFilters();
    while(remainingWords.length > 1) {
        console.log('_ = char not used');
        console.log('? = char used elsewhere');
        console.log('. = char in correct location');
        const compareResultStr = await rl.question('\nWhat is the current state? ');
        stateFilters.addCompareResult(CompareResult.fromString(currentWord, compareResultStr));
        console.log(stateFilters.toString());
        remainingWords = remainingWords.filter((word) => stateFilters.matches(word));
        remainingWordsSet = new Set(remainingWords);
        console.log(remainingWords);
        console.log(`Num remaining words: ${remainingWords.length}`);
        // console.log(remainingWords);

        let nextWord = '';

        if (remainingWords.length === 1) {
            nextWord = remainingWords[0];
        } else {
            nextWord = getNextGuess(remainingWords);
        }
        currentWord = nextWord;
        console.log(`Next word: ${nextWord}`);
    }
    console.log('Done.');
}
main();
