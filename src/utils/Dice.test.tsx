import { describe, expect, it } from 'vitest';
import { RollDice, RollDie } from './Dice';

describe('RollDie', () => {
	it('maps rng 0 to the lowest face', () => {
		expect(RollDie(20, () => 0)).toBe(1);
	});

	it('maps rng just under 1 to the highest face', () => {
		expect(RollDie(20, () => 0.999)).toBe(20);
	});
});

describe('RollDice', () => {
	it('rolls each die in the pool using the provided rng', () => {
		expect(RollDice([4, 6, 8], () => 0.5)).toEqual([3, 4, 5]);
	});
});
