import { describe, expect, it } from 'vitest';
import { CreateAttackSheetReducer } from './AttackSheetStateReducer';
import { IAttackSheetCommand } from './AttackSheetTypes';
import { buildTestModel, buildTestState, TestCharacterState } from './test/fixtures';

describe('CreateAttackSheetReducer', () => {
	it('delegates entirely to command.apply(state, model)', () => {
		const model = buildTestModel();
		const reducer = CreateAttackSheetReducer(model);
		const state = buildTestState();
		const nextState = buildTestState({ isHit: true });
		const command: IAttackSheetCommand<TestCharacterState> = {
			apply: (prevState) => (prevState === state ? nextState : state)
		};

		expect(reducer(state, command)).toBe(nextState);
	});

	it('passes the bound model through to the command', () => {
		const model = buildTestModel();
		const reducer = CreateAttackSheetReducer(model);
		const state = buildTestState();
		let seenModel = null;
		const command: IAttackSheetCommand<TestCharacterState> = {
			apply: (prevState, commandModel) => {
				seenModel = commandModel;
				return prevState;
			}
		};

		reducer(state, command);

		expect(seenModel).toBe(model);
	});
});
