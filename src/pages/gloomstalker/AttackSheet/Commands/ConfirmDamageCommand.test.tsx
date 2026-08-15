import { describe, expect, it } from 'vitest';
import { AttackStep } from '../../GloomStalkerTypes';
import { buildTestState } from '../test/fixtures';
import ConfirmDamageCommand from './ConfirmDamageCommand';

describe('ConfirmDamageCommand', () => {
	it('advances to Results', () => {
		const state = buildTestState({ attackStep: AttackStep.PostDamageRoll });
		const result = new ConfirmDamageCommand().apply(state);

		expect(result.attackStep).toBe(AttackStep.Results);
	});
});
