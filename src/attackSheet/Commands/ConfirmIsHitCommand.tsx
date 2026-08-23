import { GetNextStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class ConfirmIsHitCommand<TCharacterState> implements IAttackSheetCommand<TCharacterState> {
	apply(prevState: AttackSheetState<TCharacterState>, model: ICharacterAttackModel<TCharacterState>): AttackSheetState<TCharacterState> {
		return {
			attackStep: GetNextStep(model, prevState.attackStep),
			characterState: model.setIsHit(prevState.characterState, true)
		};
	}
}
