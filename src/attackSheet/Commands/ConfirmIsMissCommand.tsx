import { AttackSheetState, AttackStep, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class ConfirmIsMissCommand<TCharacter> implements IAttackSheetCommand<TCharacter> {
	// A miss short-circuits the rest of the flow - there's no damage to roll.
	apply(prevState: AttackSheetState<TCharacter>, model: ICharacterAttackModel<TCharacter>): AttackSheetState<TCharacter> {
		return {
			attackStep: AttackStep.Results,
			character: model.setIsHit(prevState.character, false)
		};
	}
}
