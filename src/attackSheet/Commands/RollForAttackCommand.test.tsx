import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState, TestCharacterState } from '../test/fixtures';
import RollForAttackCommand from './RollForAttackCommand';

describe('RollForAttackCommand', () => {
	it('asks the model to roll and advances a step', () => {
		const state = buildTestState({ attackStep: AttackStep.PreHitRoll });
		const result = new RollForAttackCommand<TestCharacterState>(() => 0.5).apply(state, buildTestModel());

		expect(result.character.attackRolls).toEqual([0.5]);
		expect(result.attackStep).toBe(AttackStep.PostHitRoll);
	});

	it('defaults the rng so callers can omit it', () => {
		const state = buildTestState({ attackStep: AttackStep.PreHitRoll });
		const result = new RollForAttackCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result.character.attackRolls).toHaveLength(1);
	});
});
