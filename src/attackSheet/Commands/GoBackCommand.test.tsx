import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState, stepsWithoutPostDamageRoll, TestCharacterState } from '../test/fixtures';
import GoBackCommand from './GoBackCommand';

describe('GoBackCommand', () => {
	it('steps back one step and tells the model which transition happened', () => {
		const state = buildTestState({ attackStep: AttackStep.PostAttackRoll });
		const result = new GoBackCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result.attackStep).toBe(AttackStep.PreAttackRoll);
		expect(result.characterState.revertedFrom).toBe(AttackStep.PostAttackRoll);
		expect(result.characterState.revertedTo).toBe(AttackStep.PreAttackRoll);
	});

	it('skips steps the model omits', () => {
		const state = buildTestState({ attackStep: AttackStep.PostDamageRoll });
		const result = new GoBackCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result.attackStep).toBe(AttackStep.PreDamageRoll);
		expect(result.characterState.revertedTo).toBe(AttackStep.PreDamageRoll);
	});

	// A miss reaches the final step by skipping the damage steps, so stepping back one
	// place from there would drop the user into a step that never ran.
	it('is a no-op on the final step', () => {
		const state = buildTestState({ attackStep: AttackStep.Results });
		const result = new GoBackCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result).toBe(state);
	});

	it('is a no-op on the final step of a flow that omits steps', () => {
		const state = buildTestState({ attackStep: AttackStep.Results });
		const result = new GoBackCommand<TestCharacterState>().apply(state, buildTestModel(stepsWithoutPostDamageRoll));

		expect(result).toBe(state);
	});

	it('is a no-op on the first step', () => {
		const state = buildTestState({ attackStep: AttackStep.PreAttackRoll });
		const result = new GoBackCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result).toBe(state);
	});

	it('is a no-op for a step not in the flow', () => {
		const state = buildTestState({ attackStep: AttackStep.PostDamageRoll });
		const result = new GoBackCommand<TestCharacterState>().apply(state, buildTestModel(stepsWithoutPostDamageRoll));

		expect(result).toBe(state);
	});
});
