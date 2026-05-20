import { GloomStalkerAttackSheetState } from '../GloomStalkerTypes';
import IGSAttackSheetCommand from './Commands/IGSAttackSheetCommand';

export function AttackSheetStateReducer(state: GloomStalkerAttackSheetState, command: IGSAttackSheetCommand): GloomStalkerAttackSheetState {
	return command.apply(state);
}