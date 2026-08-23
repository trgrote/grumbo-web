import { GetNextStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class RollForAttackCommand<TCharacterState> implements IAttackSheetCommand<TCharacterState> {
	constructor(private rng: () => number = Math.random) { }

	apply(prevState: AttackSheetState<TCharacterState>, model: ICharacterAttackModel<TCharacterState>): AttackSheetState<TCharacterState> {
		return {
			attackStep: GetNextStep(model, prevState.attackStep),
			characterState: model.rollForAttack(prevState.characterState, this.rng)
		};
	}
}
