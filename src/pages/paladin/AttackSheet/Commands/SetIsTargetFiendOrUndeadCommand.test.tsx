import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import SetIsTargetFiendOrUndeadCommand from './SetIsTargetFiendOrUndeadCommand';

describe('SetIsTargetFiendOrUndeadCommand', () => {
	it('sets isTargetFiendOrUndead to the constructor value', () => {
		const state = buildTestState({ isTargetFiendOrUndead: false });

		expect(new SetIsTargetFiendOrUndeadCommand(true).apply(state).isTargetFiendOrUndead).toBe(true);
		expect(new SetIsTargetFiendOrUndeadCommand(false).apply(buildTestState({ isTargetFiendOrUndead: true })).isTargetFiendOrUndead).toBe(false);
	});
});
