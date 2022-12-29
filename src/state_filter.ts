import { CompareResult, CompareValue } from "./compare";

interface Filter {
    matches(str: string): boolean;
}

class CharNeverUsed implements Filter {
    constructor(private readonly char: string) {}

    matches(str: string): boolean {
        const result = str.indexOf(this.char) === -1
        // console.log(`CharNeverUsed(${this.char}: ${result})`);
        return result;
    }

    toString() {
        return `CharNeverUsed(${this.char})`;
    }
}

class CharUsedElsewhere implements Filter {
    constructor(
        private readonly char: string, 
        private readonly notIndex: number) {}

    matches(str: string): boolean {
        const result = str.indexOf(this.char) !== -1 &&
            str.charAt(this.notIndex) !== this.char;
        // console.log(`CharUsedElsewhere(${this.char}, ${this.notIndex}): ${result}`);
        return result;
    }

    toString() {
        return `CharUsedElsewhere(${this.char}, ${this.notIndex})`;
    }
}

class CharAtIndex implements Filter {
    constructor(
        private readonly char: string, 
        private readonly index: number) {}

        matches(str: string): boolean {
        const result = str.charAt(this.index) === this.char;
        // console.log(`CharAtIndex(${this.char}, ${this.index}): ${result}`);
        return result;
    }

    toString() {
        return `CharAtIndex(${this.char}, ${this.index})`;
    }
}

export class StateFilters {
    constructor(private readonly filters: Filter[] = []) {}

    private getFilter(char: string, index: number, value: CompareValue): Filter {
        switch (value) {
            case CompareValue.NOT_USED:
                return new CharNeverUsed(char);
            case CompareValue.WRONG_LOCATION:
                return new CharUsedElsewhere(char, index);
            case CompareValue.RIGHT_LOCATION:
                return new CharAtIndex(char, index);
            default:
                throw new Error(`Unknown CompareValue: ${value}`);
        }
    }

    addCompareResult(compareResult: CompareResult) {
        for (const [index, value] of compareResult.values.entries()) {
            const char = compareResult.guess.charAt(index);
            this.filters.push(this.getFilter(char, index, value));
        }
    }

    matches(guess: string) {
        return this.filters.every((filter) => filter.matches(guess));
    }

    fork(): StateFilters {
        return new StateFilters([...this.filters]);
    }

    toString() {
        const filterStr = this.filters.map(filter => '  ' + filter.toString()).join('\n');
        return `[${filterStr}]`;
    }
}