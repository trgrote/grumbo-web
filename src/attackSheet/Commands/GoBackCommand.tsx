import { GetPreviousStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class GoBackCommand<TCharacter> implements IAttackSheetCommand<TCharacter> {
	apply(prevState: AttackSheetState<TCharacter>, model: ICharacterAttackModel<TCharacter>): AttackSheetState<TCharacter> {
		const from = prevState.attackStep;
		const to = GetPreviousStep(model, from);

		// Already at the first step (or off the flow entirely) - nowhere to go back to.
		if (to === from) {
			return prevState;
		}

		return {
			attackStep: to,
			character: model.onStepReverted(prevState.character, from, to)
		};
	}
}
