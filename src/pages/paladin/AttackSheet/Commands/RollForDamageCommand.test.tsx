import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../PaladinTypes';
import { buildTestState, testPaladinInfo } from '../test/fixtures';
import RollForDamageCommand from './RollForDamageCommand';

describe('RollForDamageCommand', () => {
	it('rolls the weapon pool and advances to Results, with no divine smite when unused', () => {
		const state = buildTestState({ attackRolls: [10] });
		const result = new RollForDamageCommand(() => 0.5).apply(state);

		expect(result.weaponDamageRolls).toEqual([5]);
		expect(result.divineSmiteDamageRolls).toEqual([]);
		expect(result.attackStep).toBe(AttackStep.Results);
	});

	it('doubles the weapon pool on a critical hit', () => {
		const state = buildTestState({ attackRolls: [20] });
		const result = new RollForDamageCommand(() => 0).apply(state);

		expect(result.weaponDamageRolls).toEqual([1, 1]);
	});

	it('rolls the full divine smite pool: crit + improved DS + fiend/undead + spell slot 2', () => {
		const state = buildTestState({
			attackRolls: [20],
			isTargetFiendOrUndead: true,
			spellSlotUsed: 2,
			paladinInfo: { ...testPaladinInfo, hasImprovedDS: true },
		});
		const result = new RollForDamageCommand(() => 0.999).apply(state);

		// (1 + 1 + 3) * 2 for crit = 10 d8s, all rolling max (8)
		expect(result.divineSmiteDamageRolls).toEqual(new Array(10).fill(8));
	});
});
