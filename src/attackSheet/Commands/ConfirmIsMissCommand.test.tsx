import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState } from '../test/fixtures';
import ConfirmIsMissCommand from './ConfirmIsMissCommand';

describe('ConfirmIsMissCommand', () => {
	it('marks the attack as a miss and short-circuits to Results', () => {
		const state = buildTestState({ attackStep: AttackStep.PostHitRoll, isHit: true });
		const result = new ConfirmIsMissCommand().apply(state, buildTestModel());

		expect(result.character.isHit).toBe(false);
		expect(result.attackStep).toBe(AttackStep.Results);
	});
});
