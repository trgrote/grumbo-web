import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class SetApplyHuntersMarkCommand implements IGSAttackSheetCommand {
	constructor(private applyHuntersMark: boolean) { }
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		return {
			...prevState,
			applyHuntersMark: this.applyHuntersMark
		};
	}
}