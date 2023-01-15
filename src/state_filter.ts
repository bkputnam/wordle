import { compare, CompareResult, CompareValue } from "./compare";

interface Filter {
    matches(str: string): boolean;
}

/**
 * Get the index of the nth instance of subStr
 */
function nthIndex(str: string, subStr: string, n: number): number {
    let result: number|undefined = undefined;
    let searchStart = 0;
    for (let i=0; i<=n; i++) {
        result = str.indexOf(subStr, searchStart);
        if (result === -1) {
            break;
        }
        searchStart = result + subStr.length;
    }
    if (result === undefined) {
        throw new Error(`Index = undefined (n=${n})`);
    }
    return result;
}

class CharNeverUsed implements Filter {
    constructor(
        // Is this the 0th/1st/2nd/etc instance of char?
        private readonly index: number,
        private readonly char: string,
        private readonly indexes: number[]) {}

    matches(str: string): boolean {
        const result = nthIndex(str, this.char, this.index) === -1;
        // console.log(`${this.toString()} = ${result}`);
        return result;
    }

    toString() {
        return `CharNeverUsed(${this.index}, ${this.char}, [${this.indexes}])`;
    }
}

class CharUsedElsewhere implements Filter {
    private readonly indexes: number[];

    constructor(
        // Is this the 0th/1st/2nd/etc instance of char?
        private readonly index: number,
        private readonly char: string,
        private readonly notIndex: number,
        indexes: number[]) {
            this.indexes = indexes.filter((index) => index !== notIndex);
        }

    matches(str: string): boolean {
        const nthCharIndex = nthIndex(str, this.char, this.index);
        const result = this.indexes.includes(nthCharIndex);
        // console.log(`${this.toString()} = ${result}`);
        return result;
    }

    toString() {
        return `CharUsedElsewhere(${this.index}, ${this.char}, ${this.notIndex}, [${this.indexes}])`;
    }
}

class CharAtIndex implements Filter {
    constructor(
        private readonly char: string, 
        private readonly index: number) {}

    matches(str: string): boolean {
        const result = str.charAt(this.index) === this.char;
        // console.log(`${this.toString()} = ${result}`);
        return result;
    }

    toString() {
        return `CharAtIndex(${this.char}, ${this.index})`;
    }
}

export class StateFilters {
    private readonly filters: Filter[] = [];

    private createFilter(nthSighting: number, char: string, index: number, value: CompareValue, unknownLetters: number[]): Filter {
        switch (value) {
            case CompareValue.NOT_USED:
                return new CharNeverUsed(nthSighting, char, unknownLetters);
            case CompareValue.WRONG_LOCATION:
                return new CharUsedElsewhere(nthSighting, char, index, unknownLetters);
            case CompareValue.RIGHT_LOCATION:
                return new CharAtIndex(char, index);
            default:
                throw new Error(`Unknown CompareValue: ${value}`);
        }
    }

    addCompareResult(compareResult: CompareResult) {
        const unknownLetters = [];
        for (const [index, value] of compareResult.values.entries()) {
            if (value !== CompareValue.RIGHT_LOCATION) {
                unknownLetters.push(index);
            }
        }
        const nthSightingMap = new Map<string, number>();
        for (const [index, value] of compareResult.values.entries()) {
            const char = compareResult.guess.charAt(index);
            let nthSighting: number = nthSightingMap.has(char) ?
                nthSightingMap.get(char)! + 1 : 0;
            nthSightingMap.set(char, nthSighting);
            this.filters.push(this.createFilter(nthSighting, char, index, value, unknownLetters));
        }
    }

    matches(guess: string) {
        return this.filters.every((filter) => filter.matches(guess));
    }

    toString() {
        const filterStr = this.filters.map(filter => '  ' + filter.toString()).join('\n');
        return `[${filterStr}]`;
    }
}

export const TEST_ONLY = {
    ordinalIndex: nthIndex,
}