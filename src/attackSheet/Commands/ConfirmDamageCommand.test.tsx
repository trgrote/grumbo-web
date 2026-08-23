import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestModel, buildTestState } from '../test/fixtures';
import ConfirmDamageCommand from './ConfirmDamageCommand';

describe('ConfirmDamageCommand', () => {
	it('advances a step without touching character state', () => {
		const state = buildTestState({ attackStep: AttackStep.PostDamageRoll, damageRolls: [4] });
		const result = new ConfirmDamageCommand().apply(state, buildTestModel());

		expect(result.attackStep).toBe(AttackStep.Results);
		expect(result.character).toBe(state.character);
	});
});
