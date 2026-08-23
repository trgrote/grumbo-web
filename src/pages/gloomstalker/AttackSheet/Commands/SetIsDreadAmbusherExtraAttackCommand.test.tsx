import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import SetIsDreadAmbusherExtraAttackCommand from './SetIsDreadAmbusherExtraAttackCommand';

describe('SetIsDreadAmbusherExtraAttackCommand', () => {
	it('sets isDreadAmbusherExtraAttack to the constructor value', () => {
		const state = buildTestState({ isDreadAmbusherExtraAttack: false });

		expect(new SetIsDreadAmbusherExtraAttackCommand(true).apply(state).character.isDreadAmbusherExtraAttack).toBe(true);
		expect(new SetIsDreadAmbusherExtraAttackCommand(false).apply(buildTestState({ isDreadAmbusherExtraAttack: true })).character.isDreadAmbusherExtraAttack).toBe(false);
	});
});
