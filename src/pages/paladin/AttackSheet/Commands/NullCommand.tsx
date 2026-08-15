import { PaladinAttackSheetState } from "../../PaladinTypes";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class NullCommand implements IPalAttackSheetCommand {
	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		return prevState;
	}
}
