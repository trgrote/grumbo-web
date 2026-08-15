import { describe, expect, it } from 'vitest';
import { AttackSheetStateReducer } from './AttackSheetStateReducer';
import { IPalAttackSheetCommand } from './Commands/AttackSheetCommands';
import { buildTestState } from './test/fixtures';

describe('AttackSheetStateReducer', () => {
	it('delegates entirely to command.apply(state)', () => {
		const state = buildTestState();
		const nextState = buildTestState({ hasAdvantage: true });
		const command: IPalAttackSheetCommand = { apply: (prevState) => (prevState === state ? nextState : state) };

		expect(AttackSheetStateReducer(state, command)).toBe(nextState);
	});
});
