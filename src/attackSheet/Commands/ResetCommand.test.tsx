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

	// The fresh state comes from the model, which owns the character's info - not from
	// whatever info the previous state happened to be carrying. The two are identical in
	// the running app, so only a deliberately divergent prevState can tell them apart.
	it("takes the model's character state even when prevState disagrees", () => {
		const state = buildTestState({ attackRolls: [99], isHit: true });
		const result = new ResetCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result.characterState.attackRolls).toEqual([]);
		expect(result.characterState).not.toBe(state.characterState);
	});
});
