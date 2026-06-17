import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import { GloomStalkerAttackSheetStateDefault } from "../AttackSheetStateFunctions";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class AttackAgainCommand implements IGSAttackSheetCommand {
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		return GloomStalkerAttackSheetStateDefault(prevState.gloomStalkerInfo);
	}
}