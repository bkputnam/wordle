import { stat } from "fs";
import { CompareResult } from "./compare.js";
import { StateFilters } from "./state_filters.js";

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

    it('spire2', () => {
        const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('lares', '__???'));
        stateFilters.addCompareResult(
            CompareResult.fromString('seise', '._._.'));
        expect(stateFilters.matches('spire')).toBeTrue();
    });

    it('should treat 2nd letters correctly', () => {
        const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('arbor', '??_?_'));
        expect(stateFilters.matches('opera')).toBeTrue();
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

    it('water', () => {
        debugger;
        const stateFilters = new StateFilters();
        stateFilters.addCompareResult(
            CompareResult.fromString('lares', '_.?._'));
        stateFilters.addCompareResult(
            CompareResult.fromString('kydst', '____?'));
        stateFilters.addCompareResult(
            CompareResult.fromString('rater', '_....'));
       expect(stateFilters.matches('water')).toBeTrue();
    });
});
