import { CreateInitialState } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class ResetCommand<TCharacter> implements IAttackSheetCommand<TCharacter> {
	apply(_prevState: AttackSheetState<TCharacter>, model: ICharacterAttackModel<TCharacter>): AttackSheetState<TCharacter> {
		return CreateInitialState(model);
	}
}
