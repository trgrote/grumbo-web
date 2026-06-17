import { GloomStalkerAttackSheetState, AttackStep } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class ConfirmDamageCommand implements IGSAttackSheetCommand {
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		return {
			...prevState,
			attackStep: AttackStep.Results,
		};
	}
}