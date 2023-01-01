import { CompareResult } from "./compare";

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
});
