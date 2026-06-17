import { GloomStalkerAttackSheetState, AttackStep } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class ConfirmIsMissCommand implements IGSAttackSheetCommand {
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		return {
			...prevState,
			isHit: false,
			attackStep: AttackStep.Results,
		};
	}
}