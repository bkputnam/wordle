import { assert } from "console";
import { compare } from "./compare";

export function split(wordlist: string[], word: string): Map<string, Set<string>> {
    const splits = new Map<string, Set<string>>();
    for (const candidate of wordlist) {
        if (candidate === word) {
            continue;
        }
        const setId = compare(word, candidate).toString();
        if (!splits.has(setId)) {
            splits.set(setId, new Set<string>());
        }
        splits.get(setId)!.add(candidate);
    }
    return splits;
}

export function splitMin(wordlist: string[], word: string): number {
    const splitResult = split(wordlist, word);
    let min = Number.POSITIVE_INFINITY;
    for (const matches of splitResult.values()) {
        if (matches.size < min) {
            min = matches.size;
        }
    }
    return min;
}