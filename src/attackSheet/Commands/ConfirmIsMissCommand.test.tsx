import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState, stepsWithoutPostDamageRoll, TestCharacterState } from '../test/fixtures';
import ConfirmIsMissCommand from './ConfirmIsMissCommand';

describe('ConfirmIsMissCommand', () => {
	it('marks the attack as a miss and short-circuits to the final step', () => {
		const state = buildTestState({ attackStep: AttackStep.PostHitRoll, isHit: true });
		const result = new ConfirmIsMissCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result.characterState.isHit).toBe(false);
		expect(result.attackStep).toBe(AttackStep.Results);
	});

	it("short-circuits to the model's own final step rather than assuming Results", () => {
		const steps = [AttackStep.PreHitRoll, AttackStep.PostHitRoll, AttackStep.PreDamageRoll];
		const state = buildTestState({ attackStep: AttackStep.PostHitRoll });
		const result = new ConfirmIsMissCommand<TestCharacterState>().apply(state, buildTestModel(steps));

		expect(result.attackStep).toBe(AttackStep.PreDamageRoll);
	});

	it('lands on the final step of a flow that omits steps', () => {
		const state = buildTestState({ attackStep: AttackStep.PostHitRoll });
		const result = new ConfirmIsMissCommand<TestCharacterState>().apply(state, buildTestModel(stepsWithoutPostDamageRoll));

		expect(result.attackStep).toBe(AttackStep.Results);
	});
});
