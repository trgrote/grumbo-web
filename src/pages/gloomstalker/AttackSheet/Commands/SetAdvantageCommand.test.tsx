import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import SetAdvantageCommand from './SetAdvantageCommand';

describe('SetAdvantageCommand', () => {
	it('sets hasAdvantage to the constructor value', () => {
		const state = buildTestState({ hasAdvantage: false });

		expect(new SetAdvantageCommand(true).apply(state).characterState.hasAdvantage).toBe(true);
		expect(new SetAdvantageCommand(false).apply(buildTestState({ hasAdvantage: true })).characterState.hasAdvantage).toBe(false);
	});
});
