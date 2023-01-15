import { wordlist } from "./wordlist";
import * as readline from 'node:readline/promises';
import { compareAsNum, CompareResult } from "./compare";
import { StateFilters } from "./state_filters";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const groups = new Array(Math.pow(3, 5));

function getExpectedRemainingWords(wordlist: string[], word: string): number {
    groups.fill(0);
    const len = wordlist.length;
    let actualWord = '';
    for (let i=0; i<len; i++) {
        actualWord = wordlist[i];
        const result = compareAsNum(word, actualWord);
        groups[result]++;
    }

    let sum = 0;
    let numWords = 0;
    for (const size of groups) {
        sum += size * size;
        numWords += size;
    }
    return sum / numWords;
}

async function main() {
    let minExpectedRemainingWords = Number.POSITIVE_INFINITY;
    let startingWord = '---';

    const start = performance.now();

    const len = wordlist.length;
    for (let i=0; i<len; i++) {
        const word = wordlist[i];
        const expectedRemainingWords = getExpectedRemainingWords(wordlist, word);
        if (expectedRemainingWords < minExpectedRemainingWords) {
            minExpectedRemainingWords = expectedRemainingWords;
            startingWord = word;
        }
    }
    const end = performance.now();
    console.log(`Elapsed: ${(end - start) / 1000}`);

    console.log(`Starting word: ${startingWord}`);

    let remainingWords = wordlist.filter((word) => word !== startingWord);
    let remainingWordsSet = new Set(remainingWords);
    let currentWord = startingWord;
    let nextWordIsPlausible = false;
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
        minExpectedRemainingWords = Number.POSITIVE_INFINITY;

        if (remainingWords.length === 1) {
            nextWord = remainingWords[0];
        } else {
            for (const candidateWord of wordlist) {
                const candidateIsPlausible = remainingWordsSet.has(candidateWord);
                const expectedRemainingWords = getExpectedRemainingWords(remainingWords, candidateWord);
                if (expectedRemainingWords < minExpectedRemainingWords ||
                    (expectedRemainingWords === minExpectedRemainingWords && candidateIsPlausible)) {
                    minExpectedRemainingWords = expectedRemainingWords;
                    nextWord = candidateWord;
                    nextWordIsPlausible = candidateIsPlausible;
                }
            }
        }
        currentWord = nextWord;
        console.log(`Next word: ${nextWord}`);
    }
    console.log('Done.');
}
main();
