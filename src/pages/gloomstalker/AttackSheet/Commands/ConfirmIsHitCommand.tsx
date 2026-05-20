import { GloomStalkerAttackSheetState, AttackStep } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class ConfirmIsHitCommand implements IGSAttackSheetCommand {
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		return {
			...prevState,
			isHit: true,
			attackStep: AttackStep.PreDamageRoll,
		};
	}
}