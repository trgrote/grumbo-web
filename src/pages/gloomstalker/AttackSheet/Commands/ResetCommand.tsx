import { GloomStalkerInfo, GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import { GloomStalkerAttackSheetStateDefault } from "../AttackSheetStateFunctions";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class ResetCommand implements IGSAttackSheetCommand {
	constructor(private gloomStalkerInfo: GloomStalkerInfo) { }

	apply(): GloomStalkerAttackSheetState {
		return GloomStalkerAttackSheetStateDefault(this.gloomStalkerInfo);
	}
}