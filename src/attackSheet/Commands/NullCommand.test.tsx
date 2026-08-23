import { describe, expect, it } from 'vitest';
import { buildTestState, TestCharacterState } from '../test/fixtures';
import NullCommand from './NullCommand';

describe('NullCommand', () => {
	it('returns the previous state unchanged', () => {
		const state = buildTestState();

		expect(new NullCommand<TestCharacterState>().apply(state)).toBe(state);
	});
});
