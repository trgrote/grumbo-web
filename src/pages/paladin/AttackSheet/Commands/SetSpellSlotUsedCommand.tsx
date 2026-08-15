import { PaladinAttackSheetState } from "../../PaladinTypes";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class SetSpellSlotUsedCommand implements IPalAttackSheetCommand {
	constructor(private spellSlotUsed: number) { }

	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		return {
			...prevState,
			spellSlotUsed: this.spellSlotUsed
		};
	}
}
