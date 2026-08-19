import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../PaladinTypes';
import { buildTestState } from '../test/fixtures';
import GoBackCommand from './GoBackCommand';

describe('GoBackCommand', () => {
	it('returns from PostAttackRoll to PreAttackRoll and clears the attack roll/hit flag', () => {
		const state = buildTestState({ attackStep: AttackStep.PostAttackRoll, attackRolls: [15], isHit: true });
		const result = new GoBackCommand().apply(state);

		expect(result.attackStep).toBe(AttackStep.PreAttackRoll);
		expect(result.attackRolls).toEqual([]);
		expect(result.isHit).toBe(false);
	});

	it('returns from PreDamageRoll to PostAttackRoll without clearing anything', () => {
		const state = buildTestState({ attackStep: AttackStep.PreDamageRoll, attackRolls: [15], isHit: true });
		const result = new GoBackCommand().apply(state);

		expect(result.attackStep).toBe(AttackStep.PostAttackRoll);
		expect(result.attackRolls).toEqual([15]);
		expect(result.isHit).toBe(true);
	});

	it('is a no-op from any other step', () => {
		const state = buildTestState({ attackStep: AttackStep.PreAttackRoll });
		const result = new GoBackCommand().apply(state);

		expect(result).toBe(state);
	});

	it('is a no-op from Results', () => {
		const state = buildTestState({ attackStep: AttackStep.Results });
		const result = new GoBackCommand().apply(state);

		expect(result).toBe(state);
	});
});
