import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../GloomStalkerTypes';
import { buildTestState } from '../test/fixtures';
import GoBackCommand from './GoBackCommand';

describe('GoBackCommand', () => {
	it('returns from PostHitRoll to PreHitRoll and clears the attack roll/hit flag', () => {
		const state = buildTestState({ attackStep: AttackStep.PostHitRoll, attackRolls: [15], isHit: true });
		const result = new GoBackCommand().apply(state);

		expect(result.attackStep).toBe(AttackStep.PreHitRoll);
		expect(result.attackRolls).toEqual([]);
		expect(result.isHit).toBe(false);
	});

	it('returns from PreDamageRoll to PostHitRoll without clearing anything', () => {
		const state = buildTestState({ attackStep: AttackStep.PreDamageRoll, attackRolls: [15] });
		const result = new GoBackCommand().apply(state);

		expect(result.attackStep).toBe(AttackStep.PostHitRoll);
		expect(result.attackRolls).toEqual([15]);
	});

	it('returns from PostDamageRoll to PreDamageRoll and clears the damage pools/rolls', () => {
		const state = buildTestState({
			attackStep: AttackStep.PostDamageRoll,
			piercingDamageDicePool: [8],
			piercingDamageRolls: [5],
			fireDamageDicePool: [6],
			fireDamageRolls: [3],
			forceDamageDicePool: [6],
			forceDamageRolls: [2],
		});
		const result = new GoBackCommand().apply(state);

		expect(result.attackStep).toBe(AttackStep.PreDamageRoll);
		expect(result.piercingDamageDicePool).toEqual([]);
		expect(result.piercingDamageRolls).toEqual([]);
		expect(result.fireDamageDicePool).toEqual([]);
		expect(result.fireDamageRolls).toEqual([]);
		expect(result.forceDamageDicePool).toEqual([]);
		expect(result.forceDamageRolls).toEqual([]);
	});

	it('is a no-op from any other step', () => {
		const state = buildTestState({ attackStep: AttackStep.PreHitRoll });
		const result = new GoBackCommand().apply(state);

		expect(result).toBe(state);
	});
});
