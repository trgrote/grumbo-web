import { GetNextStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class RollForAttackCommand<TCharacter> implements IAttackSheetCommand<TCharacter> {
	constructor(private rng: () => number = Math.random) { }

	apply(prevState: AttackSheetState<TCharacter>, model: ICharacterAttackModel<TCharacter>): AttackSheetState<TCharacter> {
		return {
			attackStep: GetNextStep(model, prevState.attackStep),
			character: model.rollForAttack(prevState.character, this.rng)
		};
	}
}
