import { split, splitMin } from "./split";
import { wordlist } from "./wordlist";
import * as readline from 'node:readline/promises';
import { compare, CompareResult } from "./compare";
import { StateFilters } from "./state_filter";
import { group } from "node:console";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getExpectedRemainingWords(wordlist: string[], word: string): number {
    const groups = new Map<string, Set<string>>();
    for (const actualWord of wordlist) {
        if (actualWord === word) {
            continue;
        }
        const result = compare(word, actualWord).valueStr();
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
    return sum / numWords;
}

async function main() {
    let minExpectedRemainingWords = Number.POSITIVE_INFINITY;
    let startingWord = '---';

    for (const word of wordlist) {
        const expectedRemainingWords = getExpectedRemainingWords(wordlist, word);
        if (expectedRemainingWords < minExpectedRemainingWords) {
            minExpectedRemainingWords = expectedRemainingWords;
            startingWord = word;
        }
    }

    console.log(`Starting word: ${startingWord}`);

    let remainingWords = wordlist.filter((word) => word !== startingWord);
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
        console.log(remainingWords);
        console.log(`Num remaining words: ${remainingWords.length}`);
        // console.log(remainingWords);

        let nextWord = '';
        minExpectedRemainingWords = Number.POSITIVE_INFINITY;

        for (const candidateWord of remainingWords) {
            const expectedRemainingWords = getExpectedRemainingWords(remainingWords, candidateWord);
            if (expectedRemainingWords < minExpectedRemainingWords) {
                minExpectedRemainingWords = expectedRemainingWords;
                nextWord = candidateWord;
            }
        }
        currentWord = nextWord;
        console.log(`Next word: ${nextWord}`);
    }
    console.log('Done.');
}
main();
