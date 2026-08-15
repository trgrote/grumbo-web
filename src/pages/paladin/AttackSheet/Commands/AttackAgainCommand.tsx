import { PaladinAttackSheetState } from "../../PaladinTypes";
import { PaladinAttackSheetStateDefault } from "../AttackSheetStateFunctions";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class AttackAgainCommand implements IPalAttackSheetCommand {
	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		return PaladinAttackSheetStateDefault(prevState.paladinInfo);
	}
}
