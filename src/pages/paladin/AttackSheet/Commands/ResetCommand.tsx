import { PaladinAttackSheetState, PaladinInfo } from "../../PaladinTypes";
import { PaladinAttackSheetStateDefault } from "../AttackSheetStateFunctions";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class ResetCommand implements IPalAttackSheetCommand {
	constructor(private paladinInfo: PaladinInfo) { }

	apply(): PaladinAttackSheetState {
		return PaladinAttackSheetStateDefault(this.paladinInfo);
	}
}
