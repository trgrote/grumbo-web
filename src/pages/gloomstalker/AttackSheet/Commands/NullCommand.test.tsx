import { describe, expect, it } from 'vitest';
import { buildTestState } from '../test/fixtures';
import NullCommand from './NullCommand';

describe('NullCommand', () => {
	it('returns the same state instance unchanged', () => {
		const state = buildTestState();
		expect(new NullCommand().apply(state)).toBe(state);
	});
});
