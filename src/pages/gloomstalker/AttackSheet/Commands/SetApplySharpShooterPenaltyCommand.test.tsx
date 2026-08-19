import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import SetApplySharpShooterPenaltyCommand from './SetApplySharpShooterPenaltyCommand';

describe('SetApplySharpShooterPenaltyCommand', () => {
	it('sets applySharpShooterPenalty to the constructor value', () => {
		const state = buildTestState({ applySharpShooterPenalty: false });

		expect(new SetApplySharpShooterPenaltyCommand(true).apply(state).applySharpShooterPenalty).toBe(true);
		expect(new SetApplySharpShooterPenaltyCommand(false).apply(buildTestState({ applySharpShooterPenalty: true })).applySharpShooterPenalty).toBe(false);
	});
});
