import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import RerollWorstDamageDieCommand from './RerollWorstDamageDieCommand';

describe('RerollWorstDamageDieCommand', () => {
	it('leaves state unchanged when nothing is rerollable', () => {
		const state = buildTestState({
			piercingDamageDicePool: [6],
			piercingDamageRolls: [6],
			fireDamageDicePool: [6],
			fireDamageRolls: [6],
		});

		const result = new RerollWorstDamageDieCommand(() => 0.999).apply(state);

		expect(result).toEqual(state);
	});

	it('rerolls the worst piercing die and flags hasUsedReroll', () => {
		const state = buildTestState({
			piercingDamageDicePool: [8, 6],
			piercingDamageRolls: [1, 6],
			fireDamageDicePool: [],
			fireDamageRolls: [],
		});

		const result = new RerollWorstDamageDieCommand(() => 0.999).apply(state);

		expect(result.piercingDamageRolls).toEqual([8, 6]);
		expect(result.hasUsedReroll).toBe(true);
	});

	it('rerolls the worst fire die when no piercing die is rerollable', () => {
		const state = buildTestState({
			piercingDamageDicePool: [6],
			piercingDamageRolls: [6],
			fireDamageDicePool: [6],
			fireDamageRolls: [1],
		});

		const result = new RerollWorstDamageDieCommand(() => 0.5).apply(state);

		expect(result.fireDamageRolls).toEqual([4]);
		expect(result.piercingDamageRolls).toEqual([6]);
		expect(result.hasUsedReroll).toBe(true);
	});
});
