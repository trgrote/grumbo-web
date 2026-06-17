import { GloomStalkerAttackSheetState } from '../GloomStalkerTypes';
import { IGSAttackSheetCommand } from './Commands/AttackSheetCommands';

export function AttackSheetStateReducer(state: GloomStalkerAttackSheetState, command: IGSAttackSheetCommand): GloomStalkerAttackSheetState {
	return command.apply(state);
}