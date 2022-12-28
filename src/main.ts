import { split, splitMin } from "./split";
import { wordlist } from "./wordlist";
import * as readline from 'node:readline/promises';
import { compare, CompareResult } from "./compare";
import { StateFilters } from "./state_filter";

let minExpectedRemainingWords = Number.POSITIVE_INFINITY;
let bestWord = '---';

for (const startingWord of wordlist) {
    const groups = new Map<string, Set<string>>();
    for (const actualWord of wordlist) {
        if (actualWord === startingWord) {
            continue;
        }
        const result = compare(startingWord, actualWord).valueStr();
        if (!groups.has(result)) {
            groups.set(result, new Set<string>());
        }
        groups.get(result)!.add(actualWord);
    }

    let sum = 0;
    let numWords = 0;
    for (const matchingWords of groups.values()) {
        sum += matchingWords.size * matchingWords.size;
        numWords += matchingWords.size;
    }
    const expectedRemainingWords = sum / numWords;
    console.log(`${startingWord}: ${expectedRemainingWords}`);
    if (expectedRemainingWords < minExpectedRemainingWords) {
        minExpectedRemainingWords = expectedRemainingWords;
        bestWord = startingWord;
    }
}

console.log(`Best starting word: ${bestWord}`);
console.log(`Expected remaining words: ${minExpectedRemainingWords}`);

// stateFilter.addCompareResult(CompareResult.fromString('__.__'));
// console.log(stateFilter.matches('belch'));

// async function main() {
//     const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//     });

//     const guessedWords = new Set<string>();

//     console.log(
//         'The "current state" is whatever characters you know. ' +
//         'Use _ to indicate an unknown character, e.g. _____ for the ' +
//         'starting state, or _e_ch if you know those 3 letters.');

//     while (true) {
//         const currentState = await rl.question('\nWhat is the current state? ');
//         if (currentState.length !== 5) {
//             console.log('The current state must have exactly 5 letters. Please try again.');
//             continue;
//         }
//         const currentStateLetters = currentState.split('');

//         const filteredWordList = wordlist.filter((word) => {
//             if (guessedWords.has(word)) {
//                 return false;
//             }
//             for (let i=0; i<currentStateLetters.length; i++) {
//                 if (currentStateLetters[i] === '_' ||
//                     currentStateLetters[i] === word.charAt(i)) {
//                     continue;
//                 }
//                 return false;
//             }
//             return true;
//         });

//         let max = -Number.POSITIVE_INFINITY;
//         let bestWord = '---';

//         for (const word of filteredWordList) {
//             const minGroupSize = splitMin(wordlist, word);
//             if (minGroupSize > max) {
//                 max = minGroupSize;
//                 bestWord = word;
//             }
//         }
//         console.log(`You should guess: ${bestWord}`);
//         guessedWords.add(bestWord);
//     }
// }
// main();