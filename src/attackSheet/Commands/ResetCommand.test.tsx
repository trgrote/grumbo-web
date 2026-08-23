import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState, testCharacterStateDefault, TestCharacterState } from '../test/fixtures';
import ResetCommand from './ResetCommand';

describe('ResetCommand', () => {
	it('rebuilds initial state from the model, ignoring the previous state', () => {
		const state = buildTestState({ attackStep: AttackStep.Results, isHit: true, damageRolls: [4] });
		const result = new ResetCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result.attackStep).toBe(AttackStep.PreAttackRoll);
		expect(result.characterState).toEqual(testCharacterStateDefault);
	});
});
