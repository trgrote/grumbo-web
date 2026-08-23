import { describe, expect, it } from 'vitest';
import { AttackStep } from '../AttackSheetTypes';
import { buildTestState, TestCharacterState } from '../test/fixtures';
import CharacterStateCommand from './CharacterStateCommand';

class SetIsHitTestCommand extends CharacterStateCommand<TestCharacterState> {
	constructor(private isHit: boolean) { super(); }

	protected applyToCharacterState(characterState: TestCharacterState): TestCharacterState {
		return { ...characterState, isHit: this.isHit };
	}
}

describe('CharacterStateCommand', () => {
	it('applies the subclass transform to the character slice only', () => {
		const state = buildTestState({ attackStep: AttackStep.PreHitRoll });
		const result = new SetIsHitTestCommand(true).apply(state);

		expect(result.characterState.isHit).toBe(true);
		expect(result.attackStep).toBe(AttackStep.PreHitRoll);
	});

	it('does not mutate the previous state', () => {
		const state = buildTestState();
		new SetIsHitTestCommand(true).apply(state);

		expect(state.characterState.isHit).toBe(false);
	});
});
