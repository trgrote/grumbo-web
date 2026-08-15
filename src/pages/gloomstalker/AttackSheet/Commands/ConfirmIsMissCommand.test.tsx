import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../GloomStalkerTypes';
import { buildTestState } from '../test/fixtures';
import ConfirmIsMissCommand from './ConfirmIsMissCommand';

describe('ConfirmIsMissCommand', () => {
	it('marks the attack as a miss and jumps straight to Results', () => {
		const state = buildTestState({ isHit: true, attackStep: AttackStep.PostHitRoll });
		const result = new ConfirmIsMissCommand().apply(state);

		expect(result.isHit).toBe(false);
		expect(result.attackStep).toBe(AttackStep.Results);
	});
});
