import { GloomStalkerAttackSheetState, AttackStep } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class GoBackCommand implements IGSAttackSheetCommand {
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		switch (prevState.attackStep) {
			case AttackStep.PostHitRoll:
				return {
					...prevState,
					attackStep: AttackStep.PreHitRoll,
					attackRolls: [],
					isHit: false,
				};
			case AttackStep.PreDamageRoll:
				return {
					...prevState,
					attackStep: AttackStep.PostHitRoll,
				};
			case AttackStep.PostDamageRoll:
				return {
					...prevState,
					attackStep: AttackStep.PreDamageRoll,
					piercingDamageRolls: [],
					fireDamageRolls: [],
					piercingDamageDicePool: [],
					fireDamageDicePool: [],
					forceDamageRolls: [],
					forceDamageDicePool: [],
				};
			default:
				return prevState;
		}
	}
}