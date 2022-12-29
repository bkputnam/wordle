import { stat } from "fs";
import { CompareResult } from "./compare";
import { StateFilters } from "./state_filter";


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
});
