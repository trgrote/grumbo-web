import { PaladinAttackSheetState } from '../PaladinTypes';
import { IPalAttackSheetCommand } from './Commands/AttackSheetCommands';

export function AttackSheetStateReducer(state: PaladinAttackSheetState, command: IPalAttackSheetCommand): PaladinAttackSheetState {
	return command.apply(state);
}
