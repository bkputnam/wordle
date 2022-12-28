import { assert } from "console";
import { zip } from "./iter";

export class CompareResult {
    private str: string|null;

    constructor (private readonly places: Array<string|null>) {}

    toString(): string {
        if (!this.str) {
            this.str = this.places.map((c) => c ?? '_').join('');
        }
        return this.str!;
    }

    static equals(c1: CompareResult, c2: CompareResult): boolean {
        assert(c1.places.length === c2.places.length);
        for (let i=0; i<c1.places.length; i++) {
            if (c1.places[i] !== c2.places[i]) {
                return false;
            }
        }
        return true;
    }

    equals(other: CompareResult): boolean {
        return CompareResult.equals(this, other);
    }
}

export function compare(word1: string, word2: string): CompareResult {
    assert(word1.length === word2.length);
    return new CompareResult(
        [...zip(word1, word2)]
            .map(([c1, c2]) => c1 === c2 ? c1 : null));
}