import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState, TestCharacterState } from '../test/fixtures';
import ConfirmIsHitCommand from './ConfirmIsHitCommand';

describe('ConfirmIsHitCommand', () => {
	it('marks the attack as a hit and advances a step', () => {
		const state = buildTestState({ attackStep: AttackStep.PostHitRoll });
		const result = new ConfirmIsHitCommand<TestCharacterState>().apply(state, buildTestModel());

		expect(result.character.isHit).toBe(true);
		expect(result.attackStep).toBe(AttackStep.PreDamageRoll);
	});
});
