import { GetNextStep } from "../AttackSheetStateFunctions";
import { AttackSheetState, IAttackSheetCommand, ICharacterAttackModel } from "../AttackSheetTypes";

export default class ConfirmDamageCommand<TCharacterState> implements IAttackSheetCommand<TCharacterState> {
	apply(prevState: AttackSheetState<TCharacterState>, model: ICharacterAttackModel<TCharacterState>): AttackSheetState<TCharacterState> {
		return {
			...prevState,
			attackStep: GetNextStep(model, prevState.attackStep)
		};
	}
}
