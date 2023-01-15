import { compare, CompareResult, CompareValue } from "./compare";

describe('Compare', () => {
    it('should compute valueNum correctly', () => {
        const compare = CompareResult.fromString('hello', '_____');
        expect(compare.valueNum()).toBe(0);
    });
    it('should compute valueNum correctly (2)', () => {
        const compare = CompareResult.fromString('hello', '__?._');
        // 3^0 = 1
        // 3^1 = 3
        // 3^2 = 9
        // 3^3 = 27
        // 3^4 = 81
        expect(compare.valueNum()).toBe((1 * 9) + (2 * 27));
    });
    it('should handle double letters', () => {
        const result = compare('arbor', 'opera');
        expect(result.values).toEqual([
            CompareValue.WRONG_LOCATION,
            CompareValue.WRONG_LOCATION,
            CompareValue.NOT_USED,
            CompareValue.WRONG_LOCATION,
            CompareValue.NOT_USED,
        ]);
    });
    it('boing -> noise', () => {
        const result = compare('boing', 'noise');
        expect(result.values).toEqual([
            CompareValue.NOT_USED,
            CompareValue.RIGHT_LOCATION,
            CompareValue.RIGHT_LOCATION,
            CompareValue.WRONG_LOCATION,
            CompareValue.NOT_USED,
        ]);
    });
    it('baaaa -> aaaac', () => {
        const result = compare('baaaa', 'aaaac');
        expect(result.values).toEqual([
            CompareValue.NOT_USED,
            CompareValue.RIGHT_LOCATION,
            CompareValue.RIGHT_LOCATION,
            CompareValue.RIGHT_LOCATION,
            CompareValue.WRONG_LOCATION,
        ]);
    });
    it('aaaab -> caaaa', () => {
        const result = compare('aaaab', 'caaaa');
        expect(result.values).toEqual([
            CompareValue.WRONG_LOCATION,
            CompareValue.RIGHT_LOCATION,
            CompareValue.RIGHT_LOCATION,
            CompareValue.RIGHT_LOCATION,
            CompareValue.NOT_USED,
        ]);
    });
});
