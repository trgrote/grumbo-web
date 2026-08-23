import { CreateInitialState } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class ResetCommand<TCharacterState> implements IAttackSheetCommand<TCharacterState> {
	apply(_prevState: AttackSheetState<TCharacterState>, model: ICharacterAttackModel<TCharacterState>): AttackSheetState<TCharacterState> {
		return CreateInitialState(model);
	}
}
