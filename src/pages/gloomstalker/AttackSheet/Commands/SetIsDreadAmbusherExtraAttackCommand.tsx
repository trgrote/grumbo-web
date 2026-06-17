import { GloomStalkerAttackSheetState } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class SetIsDreadAmbusherExtraAttackCommand implements IGSAttackSheetCommand {
	constructor(private isDreadAmbusherExtraAttack: boolean) { }

	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		return {
			...prevState,
			isDreadAmbusherExtraAttack: this.isDreadAmbusherExtraAttack
		};
	}
}