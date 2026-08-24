import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import SetSpellSlotUsedCommand from './SetSpellSlotUsedCommand';

describe('SetSpellSlotUsedCommand', () => {
	it('sets spellSlotUsed to the constructor value', () => {
		const state = buildTestState({ spellSlotUsed: 0 });

		expect(new SetSpellSlotUsedCommand(3).apply(state).characterState.spellSlotUsed).toBe(3);
		expect(new SetSpellSlotUsedCommand(0).apply(buildTestState({ spellSlotUsed: 2 })).characterState.spellSlotUsed).toBe(0);
	});
});
