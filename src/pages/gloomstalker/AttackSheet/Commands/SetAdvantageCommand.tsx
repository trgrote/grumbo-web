import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class SetAdvantageCommand implements IGSAttackSheetCommand {
	constructor(private hasAdvantage: boolean) { }

	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		return {
			...prevState,
			hasAdvantage: this.hasAdvantage
		};
	}
}