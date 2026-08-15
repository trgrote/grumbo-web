import { AttackStep, PaladinAttackSheetState } from "../../PaladinTypes";
import IPalAttackSheetCommand from "./IPalAttackSheetCommand";

export default class GoBackCommand implements IPalAttackSheetCommand {
	apply(prevState: PaladinAttackSheetState): PaladinAttackSheetState {
		switch (prevState.attackStep) {
			case AttackStep.PostAttackRoll:
				return {
					...prevState,
					attackStep: AttackStep.PreAttackRoll,
					attackRolls: [],
					isHit: false,
				};
			case AttackStep.PreDamageRoll:
				return {
					...prevState,
					attackStep: AttackStep.PostAttackRoll,
				};
			default:
				return prevState;
		}
	}
}
