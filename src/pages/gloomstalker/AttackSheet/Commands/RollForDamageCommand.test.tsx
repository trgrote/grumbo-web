import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../GloomStalkerTypes';
import { buildTestState } from '../test/fixtures';
import RollForDamageCommand from './RollForDamageCommand';

describe('RollForDamageCommand', () => {
	it('builds the dice pools, rolls them, and advances to PostDamageRoll', () => {
		const state = buildTestState({ attackRolls: [10], hasUsedReroll: true });
		const result = new RollForDamageCommand(() => 0.5).apply(state);

		expect(result.piercingDamageDicePool).toEqual([8]);
		expect(result.piercingDamageRolls).toEqual([5]);
		expect(result.fireDamageDicePool).toEqual([6]);
		expect(result.fireDamageRolls).toEqual([4]);
		expect(result.forceDamageDicePool).toEqual([]);
		expect(result.forceDamageRolls).toEqual([]);
		expect(result.attackStep).toBe(AttackStep.PostDamageRoll);
		expect(result.hasUsedReroll).toBe(false);
	});

	it('doubles the pools on a critical hit', () => {
		const state = buildTestState({ attackRolls: [20] });
		const result = new RollForDamageCommand(() => 0).apply(state);

		expect(result.piercingDamageDicePool).toEqual([8, 8, 8]);
		expect(result.fireDamageDicePool).toEqual([6, 6]);
	});

	it("builds and rolls the force pool when Hunter's Mark is applied", () => {
		const state = buildTestState({ attackRolls: [10], applyHuntersMark: true });
		const result = new RollForDamageCommand(() => 0.5).apply(state);

		expect(result.forceDamageDicePool).toEqual([6]);
		expect(result.forceDamageRolls).toEqual([4]);
	});
});
