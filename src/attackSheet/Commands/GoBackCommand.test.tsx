import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState, stepsWithoutPostDamageRoll } from '../test/fixtures';
import GoBackCommand from './GoBackCommand';

describe('GoBackCommand', () => {
	it('steps back one step and tells the model which transition happened', () => {
		const state = buildTestState({ attackStep: AttackStep.PostHitRoll });
		const result = new GoBackCommand().apply(state, buildTestModel());

		expect(result.attackStep).toBe(AttackStep.PreHitRoll);
		expect(result.character.revertedFrom).toBe(AttackStep.PostHitRoll);
		expect(result.character.revertedTo).toBe(AttackStep.PreHitRoll);
	});

	it('skips steps the model omits', () => {
		const state = buildTestState({ attackStep: AttackStep.Results });
		const result = new GoBackCommand().apply(state, buildTestModel(stepsWithoutPostDamageRoll));

		expect(result.attackStep).toBe(AttackStep.PreDamageRoll);
		expect(result.character.revertedTo).toBe(AttackStep.PreDamageRoll);
	});

	it('is a no-op on the first step', () => {
		const state = buildTestState({ attackStep: AttackStep.PreHitRoll });
		const result = new GoBackCommand().apply(state, buildTestModel());

		expect(result).toBe(state);
	});

	it('is a no-op for a step not in the flow', () => {
		const state = buildTestState({ attackStep: AttackStep.PostDamageRoll });
		const result = new GoBackCommand().apply(state, buildTestModel(stepsWithoutPostDamageRoll));

		expect(result).toBe(state);
	});
});
