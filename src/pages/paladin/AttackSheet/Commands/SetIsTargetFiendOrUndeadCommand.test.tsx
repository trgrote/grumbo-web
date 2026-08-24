import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import SetIsTargetFiendOrUndeadCommand from './SetIsTargetFiendOrUndeadCommand';

describe('SetIsTargetFiendOrUndeadCommand', () => {
	it('sets isTargetFiendOrUndead to the constructor value', () => {
		const state = buildTestState({ isTargetFiendOrUndead: false });

		expect(new SetIsTargetFiendOrUndeadCommand(true).apply(state).characterState.isTargetFiendOrUndead).toBe(true);
		expect(new SetIsTargetFiendOrUndeadCommand(false).apply(buildTestState({ isTargetFiendOrUndead: true })).characterState.isTargetFiendOrUndead).toBe(false);
	});
});
