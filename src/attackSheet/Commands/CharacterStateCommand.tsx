import { AttackSheetState, IAttackSheetCommand } from "../AttackSheetTypes";

// Base for commands that only touch character state and leave the flow alone.
// Subclasses operate on the character slice and never see the attack step.
export default abstract class CharacterStateCommand<TCharacterState> implements IAttackSheetCommand<TCharacterState> {
	apply(prevState: AttackSheetState<TCharacterState>): AttackSheetState<TCharacterState> {
		return {
			...prevState,
			characterState: this.applyToCharacterState(prevState.characterState)
		};
	}

	protected abstract applyToCharacterState(characterState: TCharacterState): TCharacterState;
}
