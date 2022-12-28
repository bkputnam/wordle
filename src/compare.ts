
export enum CompareValue {
    NOT_USED,
    WRONG_LOCATION,
    RIGHT_LOCATION,
}

export class CompareResult {
    constructor(readonly guess: string, readonly values: CompareValue[]) {}

    static fromString(guess: string, str: string) {
        return new CompareResult(guess, str.split('').map((char) => {
            switch (char) {
                case '_':
                    return CompareValue.NOT_USED;
                case '?':
                    return CompareValue.WRONG_LOCATION;
                case '.':
                    return CompareValue.RIGHT_LOCATION;
                default:
                    throw new Error(`Unexpected CompareResult string: ${char}`);
            }
        }));
    }

    valueStr(): string {
        return this.values.map((value) => {
            switch (value) {
                case CompareValue.NOT_USED:
                    return '_';
                case CompareValue.WRONG_LOCATION:
                    return '?';
                case CompareValue.RIGHT_LOCATION:
                    return '.';
            }
        }).join('');
    }

    toString(): string {
        return `${this.guess}|${this.valueStr()}`;
    }
}

export function compare(guess: string, actual: string): CompareResult {
    if (guess.length !== actual.length) {
        throw new Error(`Guess was wrong length: expected ${actual.length}, got ${guess.length}`);
    }
    const values: CompareValue[] = [];
    for (let i=0; i<guess.length; i++) {
        const char = guess.charAt(i);
        if (actual.charAt(i) === char) {
            values.push(CompareValue.RIGHT_LOCATION);
        } else if (actual.indexOf(char) !== -1) {
            values.push(CompareValue.WRONG_LOCATION);
        } else {
            values.push(CompareValue.NOT_USED);
        }
    }
    return new CompareResult(guess, values);
}