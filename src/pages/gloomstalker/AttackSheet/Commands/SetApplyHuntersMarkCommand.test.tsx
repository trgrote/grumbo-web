import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import SetApplyHuntersMarkCommand from './SetApplyHuntersMarkCommand';

describe('SetApplyHuntersMarkCommand', () => {
	it('sets applyHuntersMark to the constructor value', () => {
		const state = buildTestState({ applyHuntersMark: false });

		expect(new SetApplyHuntersMarkCommand(true).apply(state).character.applyHuntersMark).toBe(true);
		expect(new SetApplyHuntersMarkCommand(false).apply(buildTestState({ applyHuntersMark: true })).character.applyHuntersMark).toBe(false);
	});
});
