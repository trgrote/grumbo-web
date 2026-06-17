import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class SetApplySharpShooterPenaltyCommand implements IGSAttackSheetCommand {
	constructor(private applySharpShooterPenalty: boolean) { }
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		return {
			...prevState,
			applySharpShooterPenalty: this.applySharpShooterPenalty
		};
	}
}