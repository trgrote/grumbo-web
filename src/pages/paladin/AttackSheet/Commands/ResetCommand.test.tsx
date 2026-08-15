import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../PaladinTypes';
import { PaladinAttackSheetStateDefault } from '../AttackSheetStateFunctions';
import { testPaladinInfo } from '../test/fixtures';
import ResetCommand from './ResetCommand';

describe('ResetCommand', () => {
	it('produces a fresh default state for the given paladinInfo', () => {
		const result = new ResetCommand(testPaladinInfo).apply();

		expect(result).toEqual(PaladinAttackSheetStateDefault(testPaladinInfo));
		expect(result.attackStep).toBe(AttackStep.PreAttackRoll);
	});
});
