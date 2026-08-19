import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../PaladinTypes';
import { buildTestState, testPaladinInfo } from '../test/fixtures';
import AttackAgainCommand from './AttackAgainCommand';

describe('AttackAgainCommand', () => {
	it('rebuilds default state from the paladinInfo carried on prevState', () => {
		const state = buildTestState({
			attackStep: AttackStep.Results,
			attackRolls: [20],
			isHit: true,
			hasAdvantage: true,
			paladinInfo: { ...testPaladinInfo, attackModifier: 99 },
		});

		const result = new AttackAgainCommand().apply(state);

		expect(result.paladinInfo.attackModifier).toBe(99);
		expect(result.attackStep).toBe(AttackStep.PreAttackRoll);
	});
});
