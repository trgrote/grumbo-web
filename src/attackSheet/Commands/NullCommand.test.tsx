import { describe, expect, it } from 'vitest';
import { buildTestModel, buildTestState } from '../test/fixtures';
import NullCommand from './NullCommand';

describe('NullCommand', () => {
	it('returns the previous state unchanged', () => {
		const state = buildTestState();

		expect(new NullCommand().apply(state, buildTestModel())).toBe(state);
	});
});
