import { describe, expect, it } from 'vitest';
import { AttackSheetStateReducer } from './AttackSheetStateReducer';
import { IGSAttackSheetCommand } from './Commands/AttackSheetCommands';
import { buildTestState } from './test/fixtures';

describe('AttackSheetStateReducer', () => {
	it('delegates entirely to command.apply(state)', () => {
		const state = buildTestState();
		const nextState = buildTestState({ hasAdvantage: true });
		const command: IGSAttackSheetCommand = { apply: (prevState) => (prevState === state ? nextState : state) };

		expect(AttackSheetStateReducer(state, command)).toBe(nextState);
	});
});
