import { AttackSheetState, IAttackSheetCommand } from "../AttackSheetTypes";

export default class NullCommand<TCharacterState> implements IAttackSheetCommand<TCharacterState> {
	apply(prevState: AttackSheetState<TCharacterState>): AttackSheetState<TCharacterState> {
		return prevState;
	}
}
