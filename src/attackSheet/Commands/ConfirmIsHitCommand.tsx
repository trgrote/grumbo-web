import { GetNextStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class ConfirmIsHitCommand<TCharacter> implements IAttackSheetCommand<TCharacter> {
	apply(prevState: AttackSheetState<TCharacter>, model: ICharacterAttackModel<TCharacter>): AttackSheetState<TCharacter> {
		return {
			attackStep: GetNextStep(model, prevState.attackStep),
			character: model.setIsHit(prevState.character, true)
		};
	}
}
