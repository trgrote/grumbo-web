import { GetFinalStep, GetPreviousStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class GoBackCommand<TCharacter> implements IAttackSheetCommand<TCharacter> {
	apply(prevState: AttackSheetState<TCharacter>, model: ICharacterAttackModel<TCharacter>): AttackSheetState<TCharacter> {
		const from = prevState.attackStep;

		// The final step is a dead end: the flow doesn't record how it got there, and a miss
		// reaches it by skipping the damage steps, so stepping back isn't safe in general.
		// Starting over is the only way out - that's what Attack Again is for.
		if (from === GetFinalStep(model)) {
			return prevState;
		}

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
