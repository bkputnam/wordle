import { split, splitMin } from "./split";
import { wordlist } from "./wordlist";
import * as readline from 'node:readline/promises';

async function main() {
    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });

    const guessedWords = new Set<string>();

    console.log(
        'The "current state" is whatever characters you know. ' +
        'Use _ to indicate an unknown character, e.g. _____ for the ' +
        'starting state, or _e_ch if you know those 3 letters.');

    while (true) {
        const currentState = await rl.question('\nWhat is the current state? ');
        if (currentState.length !== 5) {
            console.log('The current state must have exactly 5 letters. Please try again.');
            continue;
        }
        const currentStateLetters = currentState.split('');

        const filteredWordList = wordlist.filter((word) => {
            if (guessedWords.has(word)) {
                return false;
            }
            for (let i=0; i<currentStateLetters.length; i++) {
                if (currentStateLetters[i] === '_' ||
                    currentStateLetters[i] === word.charAt(i)) {
                    continue;
                }
                return false;
            }
            return true;
        });

        let max = -Number.POSITIVE_INFINITY;
        let bestWord = '---';

        for (const word of filteredWordList) {
            const minGroupSize = splitMin(wordlist, word);
            if (minGroupSize > max) {
                max = minGroupSize;
                bestWord = word;
            }
        }
        console.log(`You should guess: ${bestWord}`);
        guessedWords.add(bestWord);
    }
}
main();

// let max = -Number.POSITIVE_INFINITY;
// let bestWord = '---';

// for (const word of wordlist) {
//     const minGroupSize = splitMin(wordlist, word);
//     if (minGroupSize === 4) {
//         max = minGroupSize;
//         bestWord = word;
//     }
// }

// console.log(`best word: ${bestWord}`);
// console.log(`minGroupSize: ${max}`);