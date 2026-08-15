import { AttackStep, PaladinAttackSheetState } from "../../PaladinTypes";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class ConfirmIsHitCommand implements IPalAttackSheetCommand {
	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		return {
			...prevState,
			isHit: true,
			attackStep: AttackStep.PreDamageRoll,
		};
	}
}
