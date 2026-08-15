import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../GloomStalkerTypes';
import { buildTestState } from '../test/fixtures';
import ConfirmIsHitCommand from './ConfirmIsHitCommand';

describe('ConfirmIsHitCommand', () => {
	it('marks the attack as a hit and advances to PreDamageRoll', () => {
		const state = buildTestState({ isHit: false, attackStep: AttackStep.PostHitRoll });
		const result = new ConfirmIsHitCommand().apply(state);

		expect(result.isHit).toBe(true);
		expect(result.attackStep).toBe(AttackStep.PreDamageRoll);
	});
});
