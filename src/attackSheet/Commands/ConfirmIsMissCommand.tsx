import { GetFinalStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class ConfirmIsMissCommand<TCharacterState> implements IAttackSheetCommand<TCharacterState> {
	// A miss short-circuits the rest of the flow - there's no damage to roll.
	apply(prevState: AttackSheetState<TCharacterState>, model: ICharacterAttackModel<TCharacterState>): AttackSheetState<TCharacterState> {
		return {
			attackStep: GetFinalStep(model),
			characterState: model.setIsHit(prevState.characterState, false)
		};
	}
}
