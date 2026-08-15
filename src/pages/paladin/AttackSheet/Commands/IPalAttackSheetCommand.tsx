import { PaladinAttackSheetState } from "../../PaladinTypes";

export default interface IPalAttackSheetCommand {
	apply: (prevState: PaladinAttackSheetState) => PaladinAttackSheetState;
}
