import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../GloomStalkerTypes';
import { GloomStalkerAttackSheetStateDefault } from '../AttackSheetStateFunctions';
import { testGloomStalkerInfo } from '../test/fixtures';
import ResetCommand from './ResetCommand';

describe('ResetCommand', () => {
	it('produces a fresh default state for the given gloomStalkerInfo', () => {
		const result = new ResetCommand(testGloomStalkerInfo).apply();

		expect(result).toEqual(GloomStalkerAttackSheetStateDefault(testGloomStalkerInfo));
		expect(result.attackStep).toBe(AttackStep.PreHitRoll);
	});
});
