import { CompareResult, CompareValue } from "./compare";

interface Filter {
    matches(str: string): boolean;
}

class CharNeverUsed implements Filter {
    constructor(
        private readonly char: string,
        private readonly indexes: number[]) {}

    matches(str: string): boolean {
        const result =
            !this.indexes.some((index) => str.charAt(index) === this.char);
        // console.log(`${this.toString()} = ${result}`);
        return result;
    }

    toString() {
        return `CharNeverUsed(${this.char}, [${this.indexes}])`;
    }
}

class CharUsedElsewhere implements Filter {
    private readonly indexes: number[];

    constructor(
        private readonly char: string, 
        private readonly notIndex: number,
        indexes: number[]) {
            this.indexes = indexes.filter((index) => index !== notIndex);
        }

    matches(str: string): boolean {
        const result = str.indexOf(this.char) !== -1 &&
            this.indexes.some((index) => str.charAt(index) === this.char);
        // console.log(`${this.toString()} = ${result}`);
        return result;
    }

    toString() {
        return `CharUsedElsewhere(${this.char}, ${this.notIndex}, [${this.indexes}])`;
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
    private readonly unknownLetters = [0, 1, 2, 3, 4];
    private readonly filters: Filter[] = [];

    private getFilter(char: string, index: number, value: CompareValue): Filter {
        switch (value) {
            case CompareValue.NOT_USED:
                return new CharNeverUsed(char, [...this.unknownLetters]);
            case CompareValue.WRONG_LOCATION:
                return new CharUsedElsewhere(char, index, [...this.unknownLetters]);
            case CompareValue.RIGHT_LOCATION:
                const indexIndex = this.unknownLetters.indexOf(index);
                if (indexIndex !== -1) {
                    this.unknownLetters.splice(indexIndex, 1);
                }
                return new CharAtIndex(char, index);
            default:
                throw new Error(`Unknown CompareValue: ${value}`);
        }
    }

    addCompareResult(compareResult: CompareResult) {
        for (const [index, value] of compareResult.values.entries()) {
            if (value === CompareValue.RIGHT_LOCATION) {
                const char = compareResult.guess.charAt(index);
                this.filters.push(this.getFilter(char, index, value));
            }
        }
        for (const [index, value] of compareResult.values.entries()) {
            if (value !== CompareValue.RIGHT_LOCATION) {
                const char = compareResult.guess.charAt(index);
                this.filters.push(this.getFilter(char, index, value));
            }
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