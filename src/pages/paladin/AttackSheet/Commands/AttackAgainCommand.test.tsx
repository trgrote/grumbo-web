import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../PaladinTypes';
import { PaladinAttackSheetStateDefault } from '../AttackSheetStateFunctions';
import { buildTestState, testPaladinInfo } from '../test/fixtures';
import AttackAgainCommand from './AttackAgainCommand';

describe('AttackAgainCommand', () => {
	it('resets to a fresh default state built from the previous paladinInfo', () => {
		const state = buildTestState({
			attackStep: AttackStep.Results,
			attackRolls: [20],
			isHit: true,
			hasAdvantage: true,
		});

		const result = new AttackAgainCommand().apply(state);

		expect(result).toEqual(PaladinAttackSheetStateDefault(testPaladinInfo));
		expect(result.attackStep).toBe(AttackStep.PreAttackRoll);
	});
});
