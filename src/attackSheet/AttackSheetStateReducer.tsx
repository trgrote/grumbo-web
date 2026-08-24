import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "./AttackSheetTypes";

// Binds the character model once so Step components can keep dispatching bare commands.
export function CreateAttackSheetReducer<TCharacterState>(model: ICharacterAttackModel<TCharacterState>) {
	return function AttackSheetStateReducer(
		state: AttackSheetState<TCharacterState>,
		command: IAttackSheetCommand<TCharacterState>
	): AttackSheetState<TCharacterState> {
		return command.apply(state, model);
	};
}
