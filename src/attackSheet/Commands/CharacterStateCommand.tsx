import { AttackSheetState, IAttackSheetCommand } from "../AttackSheetTypes";

// Base for commands that only touch character state and leave the flow alone.
// Subclasses operate on the character slice and never see the attack step.
export default abstract class CharacterStateCommand<TCharacter> implements IAttackSheetCommand<TCharacter> {
	apply(prevState: AttackSheetState<TCharacter>): AttackSheetState<TCharacter> {
		return {
			...prevState,
			character: this.applyToCharacter(prevState.character)
		};
	}

	protected abstract applyToCharacter(character: TCharacter): TCharacter;
}
