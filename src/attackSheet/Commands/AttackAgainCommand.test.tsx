import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState, testCharacterStateDefault, TestCharacterState } from '../test/fixtures';
import AttackAgainCommand from './AttackAgainCommand';

describe('AttackAgainCommand', () => {
	it('asks the model for a fresh character state and returns to the first step', () => {
		const state = buildTestState({ attackStep: AttackStep.Results, isHit: true, attackRolls: [20] });
		const result = new AttackAgainCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result.attackStep).toBe(AttackStep.PreHitRoll);
		expect(result.characterState).toEqual(testCharacterStateDefault);
	});
});
