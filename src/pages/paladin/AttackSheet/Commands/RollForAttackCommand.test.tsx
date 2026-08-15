import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../PaladinTypes';
import { buildTestState } from '../test/fixtures';
import RollForAttackCommand from './RollForAttackCommand';

describe('RollForAttackCommand', () => {
	it('rolls a single d20 and advances to PostAttackRoll without advantage', () => {
		const state = buildTestState({ hasAdvantage: false });
		const result = new RollForAttackCommand(() => 0).apply(state);

		expect(result.attackRolls).toEqual([1]);
		expect(result.attackStep).toBe(AttackStep.PostAttackRoll);
	});

	it('rolls two d20s (not three) with advantage', () => {
		const state = buildTestState({ hasAdvantage: true });
		const result = new RollForAttackCommand(() => 0.999).apply(state);

		expect(result.attackRolls).toEqual([20, 20]);
	});
});
