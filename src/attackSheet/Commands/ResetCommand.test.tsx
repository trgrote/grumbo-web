import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState, testCharacterStateDefault } from '../test/fixtures';
import ResetCommand from './ResetCommand';

describe('ResetCommand', () => {
	it('rebuilds initial state from the model, ignoring the previous state', () => {
		const state = buildTestState({ attackStep: AttackStep.Results, isHit: true, damageRolls: [4] });
		const result = new ResetCommand().apply(state, buildTestModel());

		expect(result.attackStep).toBe(AttackStep.PreHitRoll);
		expect(result.character).toEqual(testCharacterStateDefault);
	});
});
