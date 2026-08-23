import { describe, expect, it } from 'vitest';
import { CreateInitialState, GetFinalStep, GetNextStep, GetPreviousStep } from './AttackSheetStateFunctions';
import { AttackStep } from './AttackSheetTypes';
import { buildTestModel, stepsWithoutPostDamageRoll, testCharacterStateDefault } from './test/fixtures';

describe('CreateInitialState', () => {
	it("starts at the model's first step with a fresh character state", () => {
		const result = CreateInitialState(buildTestModel());

		expect(result.attackStep).toBe(AttackStep.PreHitRoll);
		expect(result.character).toEqual(testCharacterStateDefault);
	});
});

describe('GetNextStep', () => {
	it('advances along the model\'s step order', () => {
		const model = buildTestModel();

		expect(GetNextStep(model, AttackStep.PreHitRoll)).toBe(AttackStep.PostHitRoll);
		expect(GetNextStep(model, AttackStep.PreDamageRoll)).toBe(AttackStep.PostDamageRoll);
	});

	it('skips steps the model omits', () => {
		const model = buildTestModel(stepsWithoutPostDamageRoll);

		expect(GetNextStep(model, AttackStep.PreDamageRoll)).toBe(AttackStep.Results);
	});

	it('is a no-op on the last step', () => {
		expect(GetNextStep(buildTestModel(), AttackStep.Results)).toBe(AttackStep.Results);
	});

	it('is a no-op for a step not in the flow', () => {
		const model = buildTestModel(stepsWithoutPostDamageRoll);

		expect(GetNextStep(model, AttackStep.PostDamageRoll)).toBe(AttackStep.PostDamageRoll);
	});
});

describe('GetFinalStep', () => {
	it("returns the last step of the model's flow", () => {
		expect(GetFinalStep(buildTestModel())).toBe(AttackStep.Results);
		expect(GetFinalStep(buildTestModel(stepsWithoutPostDamageRoll))).toBe(AttackStep.Results);
		expect(GetFinalStep(buildTestModel([AttackStep.PreHitRoll, AttackStep.PostHitRoll]))).toBe(AttackStep.PostHitRoll);
	});
});

describe('GetPreviousStep', () => {
	it('steps backwards along the model\'s step order', () => {
		const model = buildTestModel();

		expect(GetPreviousStep(model, AttackStep.PostHitRoll)).toBe(AttackStep.PreHitRoll);
		expect(GetPreviousStep(model, AttackStep.PostDamageRoll)).toBe(AttackStep.PreDamageRoll);
	});

	it('skips steps the model omits', () => {
		const model = buildTestModel(stepsWithoutPostDamageRoll);

		expect(GetPreviousStep(model, AttackStep.Results)).toBe(AttackStep.PreDamageRoll);
	});

	it('is a no-op on the first step', () => {
		expect(GetPreviousStep(buildTestModel(), AttackStep.PreHitRoll)).toBe(AttackStep.PreHitRoll);
	});

	it('is a no-op for a step not in the flow', () => {
		const model = buildTestModel(stepsWithoutPostDamageRoll);

		expect(GetPreviousStep(model, AttackStep.PostDamageRoll)).toBe(AttackStep.PostDamageRoll);
	});
});
