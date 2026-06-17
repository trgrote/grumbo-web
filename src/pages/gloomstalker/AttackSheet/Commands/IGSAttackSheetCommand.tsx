import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";

export default interface IGSAttackSheetCommand {
	apply: (prevState: GloomStalkerAttackSheetState) => GloomStalkerAttackSheetState;
}