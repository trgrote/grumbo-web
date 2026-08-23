import { describe, expect, it } from 'vitest';
import { DiceArrayToString, FormatSignedModifier, GetDetailSectionOrder, JoinWithElement, RollArrayToString } from './Formatting';

describe('RollArrayToString', () => {
	it('formats an array of rolls as a bracketed, comma-separated list', () => {
		expect(RollArrayToString([1, 2, 3])).toBe('[1, 2, 3]');
	});

	it('formats an empty array', () => {
		expect(RollArrayToString([])).toBe('[]');
	});
});

describe('DiceArrayToString', () => {
	it('formats an array of die sizes as a bracketed, comma-separated list of dice', () => {
		expect(DiceArrayToString([8, 8, 6])).toBe('[d8, d8, d6]');
	});

	it('formats an empty array', () => {
		expect(DiceArrayToString([])).toBe('[]');
	});
});

describe('FormatSignedModifier', () => {
	it('prefixes a positive modifier with +', () => {
		expect(FormatSignedModifier(3)).toBe('+3');
	});

	it('prefixes zero with +', () => {
		expect(FormatSignedModifier(0)).toBe('+0');
	});

	it('leaves a negative modifier as-is', () => {
		expect(FormatSignedModifier(-2)).toBe('-2');
	});
});

describe('GetDetailSectionOrder', () => {
	it('omits damage sections on a miss', () => {
		expect(GetDetailSectionOrder(false)).toEqual(['hitSummary', 'toHitSummary']);
	});

	it('includes damage sections around toHitSummary on a hit', () => {
		expect(GetDetailSectionOrder(true)).toEqual(['hitSummary', 'damageSummary', 'toHitSummary', 'damageRolls']);
	});
});

describe('JoinWithElement', () => {
	it('interleaves the separator between items without a trailing separator', () => {
		const items = [<li key="a">a</li>, <li key="b">b</li>, <li key="c">c</li>];
		const result = JoinWithElement(items, <li>sep</li>);

		expect(result).toHaveLength(5);
		expect(result[1].props.children).toBe('sep');
		expect(result[3].props.children).toBe('sep');
	});

	it('returns the single item unchanged when there is nothing to separate', () => {
		const items = [<li key="a">a</li>];
		expect(JoinWithElement(items, <li>sep</li>)).toEqual(items);
	});
});
