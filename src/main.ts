import { split, splitMin } from "./split";
import { wordlist } from "./wordlist";

let max = -Number.POSITIVE_INFINITY;
let bestWord = '---';

for (const word of wordlist) {
    const minGroupSize = splitMin(wordlist, word);
    if (minGroupSize === 4) {
        max = minGroupSize;
        bestWord = word;
    }
}

console.log(`best word: ${bestWord}`);
console.log(`minGroupSize: ${max}`);

// const splitResult = split(wordlist, 'belch');

// let minMatchId: string|null = null;
// let minSize = Number.POSITIVE_INFINITY;
// let minExample: string|null = null;

// let maxMatchId: string  |null = null;
// let maxSize = -Number.POSITIVE_INFINITY;
// let maxExample: string|null = null;

// for (const [matchId, matches] of splitResult.entries()) {
//     if (matches.size < minSize) {
//         minSize = matches.size;
//         minMatchId = matchId;
//         minExample = [...matches][0];
//     }
//     if (matches.size > maxSize) {
//         maxSize = matches.size;
//         maxMatchId = matchId;
//         maxExample = [...matches][0];
//     }
// }

// console.log(`min id: ${minMatchId}`);
// console.log(`min size: ${minSize}`);
// console.log(`min example: ${minExample}`);

// console.log(`max id: ${maxMatchId}`);
// console.log(`max size: ${maxSize}`);
// console.log(`max example: ${maxExample}`);