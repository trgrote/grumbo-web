import { GloomStalkerAttackSheetState, AttackStep } from "../../GloomStalkerTypes";
import IGSAttackSheetCommand from "./IGSAttackSheetCommand";

export default class GoBackCommand implements IGSAttackSheetCommand {
	apply(prevState: GloomStalkerAttackSheetState): GloomStalkerAttackSheetState {
		const prevStep = (() => {
			switch (prevState.attackStep) {
				case AttackStep.PostHitRoll:
					return AttackStep.PreHitRoll;
				case AttackStep.PreDamageRoll:
					return AttackStep.PostHitRoll;
				case AttackStep.PostDamageRoll:
					return AttackStep.PreDamageRoll;
				default:
					return prevState.attackStep;
			}
		})();

		return {
			...prevState,
			attackStep: prevStep,
		};
	}
}