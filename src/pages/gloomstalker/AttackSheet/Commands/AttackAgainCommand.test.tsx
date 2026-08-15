import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../GloomStalkerTypes';
import { GloomStalkerAttackSheetStateDefault } from '../AttackSheetStateFunctions';
import { buildTestState, testGloomStalkerInfo } from '../test/fixtures';
import AttackAgainCommand from './AttackAgainCommand';

describe('AttackAgainCommand', () => {
	it('resets to a fresh default state built from the previous gloomStalkerInfo', () => {
		const state = buildTestState({
			attackStep: AttackStep.Results,
			attackRolls: [20],
			isHit: true,
			hasAdvantage: true,
		});

		const result = new AttackAgainCommand().apply(state);

		expect(result).toEqual(GloomStalkerAttackSheetStateDefault(testGloomStalkerInfo));
		expect(result.attackStep).toBe(AttackStep.PreHitRoll);
	});
});
