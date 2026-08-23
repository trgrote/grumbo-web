import { AttackSheetState, IAttackSheetCommand } from "../AttackSheetTypes";

export default class NullCommand<TCharacter> implements IAttackSheetCommand<TCharacter> {
	apply(prevState: AttackSheetState<TCharacter>): AttackSheetState<TCharacter> {
		return prevState;
	}
}
