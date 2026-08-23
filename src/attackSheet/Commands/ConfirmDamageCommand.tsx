import { GetNextStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class ConfirmDamageCommand<TCharacter> implements IAttackSheetCommand<TCharacter> {
	apply(prevState: AttackSheetState<TCharacter>, model: ICharacterAttackModel<TCharacter>): AttackSheetState<TCharacter> {
		return {
			...prevState,
			attackStep: GetNextStep(model, prevState.attackStep)
		};
	}
}
