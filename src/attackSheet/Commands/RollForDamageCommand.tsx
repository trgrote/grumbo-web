import { GetNextStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class RollForDamageCommand<TCharacterState> implements IAttackSheetCommand<TCharacterState> {
	constructor(private rng: () => number = Math.random) { }

	apply(prevState: AttackSheetState<TCharacterState>, model: ICharacterAttackModel<TCharacterState>): AttackSheetState<TCharacterState> {
		return {
			attackStep: GetNextStep(model, prevState.attackStep),
			characterState: model.rollForDamage(prevState.characterState, this.rng)
		};
	}
}
