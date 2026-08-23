import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState, stepsWithoutPostDamageRoll } from '../test/fixtures';
import RollForDamageCommand from './RollForDamageCommand';

describe('RollForDamageCommand', () => {
	it('asks the model to roll damage and advances a step', () => {
		const state = buildTestState({ attackStep: AttackStep.PreDamageRoll });
		const result = new RollForDamageCommand(() => 0.5).apply(state, buildTestModel());

		expect(result.character.damageRolls).toEqual([0.5]);
		expect(result.attackStep).toBe(AttackStep.PostDamageRoll);
	});

	it('goes straight to Results when the model has no PostDamageRoll step', () => {
		const state = buildTestState({ attackStep: AttackStep.PreDamageRoll });
		const result = new RollForDamageCommand(() => 0.5).apply(state, buildTestModel(stepsWithoutPostDamageRoll));

		expect(result.attackStep).toBe(AttackStep.Results);
	});
});
