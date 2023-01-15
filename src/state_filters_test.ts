import { stat } from "fs";
import { CompareResult } from "./compare";
import { StateFilters, TEST_ONLY } from "./state_filter";

const {ordinalIndex} = TEST_ONLY;

describe('StateFilters', () => {
    it('should filter known chars', () => {
        const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('hello', '_.___'));
        expect(stateFilters.matches('aebcd')).toBeTrue();
        expect(stateFilters.matches('abcde')).toBeFalse();
    });

    it('should filter elsewhere chars', () => {
        const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('hello', '_?___'));
        expect(stateFilters.matches('aebcd')).toBeFalse();
        expect(stateFilters.matches('abcde')).toBeTrue();
    });

    it('should filter never chars', () => {
        const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('hello', '_____'));
        expect(stateFilters.matches('hxxxx')).toBeFalse();
        expect(stateFilters.matches('exxxx')).toBeFalse();
        expect(stateFilters.matches('lxxxx')).toBeFalse();
        expect(stateFilters.matches('oxxxx')).toBeFalse();
    });

    // Make sure that the second 'a' in 'cabal' doesn't conflict with
    // the first 'a' in 'cabal'.
    it('should only apply never chars to unknown indexes', () => {
        const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('cabal', '?.___'));
        expect(stateFilters.matches('havoc')).toBeTrue();
    });

    it('spire', () => {
        const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('lares', '__???'));
        stateFilters.addCompareResult(
            CompareResult.fromString('suete', '.___.'));
        expect(stateFilters.matches('spire')).toBeTrue();
    });

    it('should treat 2nd letters correctly', () => {
        const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('arbor', '??_?_'));
        expect(stateFilters.matches('opera')).toBeTrue();
    });

    it('ordinalIndex should work as expected', () => {
        expect(ordinalIndex('arbor', 'r', 0)).toBe(1);
        expect(ordinalIndex('arbor', 'r', 1)).toBe(4);
        expect(ordinalIndex('arbor', 'r', 2)).toBe(-1);

        expect(ordinalIndex('mississippi', 'iss', 0)).toBe(1);
        expect(ordinalIndex('mississippi', 'iss', 1)).toBe(4);
        expect(ordinalIndex('mississippi', 'iss', 2)).toBe(-1);
    });

    it('koala', () => {
       const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('lares', '??___'));
        stateFilters.addCompareResult(
            CompareResult.fromString('aloin', '???__'));
        stateFilters.addCompareResult(
            CompareResult.fromString('yclad', '__??_'));
        stateFilters.addCompareResult(
            CompareResult.fromString('baaps', '_?.__'));
       expect(stateFilters.matches('koala')).toBeTrue();
    });
});
