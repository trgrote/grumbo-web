import { AttackStep, PaladinAttackSheetState } from "../../PaladinTypes";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class ConfirmIsMissCommand implements IPalAttackSheetCommand {
	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		return {
			...prevState,
			isHit: false,
			attackStep: AttackStep.Results,
		};
	}
}
