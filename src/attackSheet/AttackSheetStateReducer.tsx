import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "./AttackSheetTypes";

// Binds the character model once so Step components can keep dispatching bare commands.
export function CreateAttackSheetReducer<TCharacter>(model: ICharacterAttackModel<TCharacter>) {
	return function AttackSheetStateReducer(
		state: AttackSheetState<TCharacter>,
		command: IAttackSheetCommand<TCharacter>
	): AttackSheetState<TCharacter> {
		return command.apply(state, model);
	};
}
