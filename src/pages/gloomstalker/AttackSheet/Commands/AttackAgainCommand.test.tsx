import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../GloomStalkerTypes';
import { buildTestState, testGloomStalkerInfo } from '../test/fixtures';
import AttackAgainCommand from './AttackAgainCommand';

describe('AttackAgainCommand', () => {
	it('rebuilds default state from the gloomStalkerInfo carried on prevState', () => {
		const state = buildTestState({
			attackStep: AttackStep.Results,
			attackRolls: [20],
			isHit: true,
			hasAdvantage: true,
			gloomStalkerInfo: { ...testGloomStalkerInfo, attackModifier: 99 },
		});

		const result = new AttackAgainCommand().apply(state);

		expect(result.gloomStalkerInfo.attackModifier).toBe(99);
		expect(result.attackStep).toBe(AttackStep.PreHitRoll);
	});
});
